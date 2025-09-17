import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import * as mlPca from "ml-pca";
import clustering from "density-clustering";

// Input schema
const requestSchema = z
  .object({
    embeddings: z.array(z.array(z.number())).optional(),
    sequence: z.string().min(1).optional(),
    fasta: z.string().min(1).optional(),
    // optional params
    pcaComponents: z.number().int().min(1).max(200).optional(),
    eps: z.number().positive().optional(),
    minSamples: z.number().int().min(1).optional(),
  })
  .refine((v) => Array.isArray(v.embeddings) || typeof v.sequence === "string" || typeof v.fasta === "string", {
    message: "Provide either embeddings or sequence",
    path: ["embeddings"],
  });

function normalizeVector(vector: number[]): number[] {
  let norm = 0;
  for (let i = 0; i < vector.length; i += 1) {
    norm += vector[i] * vector[i];
  }
  norm = Math.sqrt(norm) || 1;
  const normalized: number[] = new Array(vector.length);
  for (let i = 0; i < vector.length; i += 1) {
    normalized[i] = vector[i] / norm;
  }
  return normalized;
}

function toUnitVectors(matrix: number[][]): number[][] {
  const out: number[][] = new Array(matrix.length);
  for (let i = 0; i < matrix.length; i += 1) {
    out[i] = normalizeVector(matrix[i]);
  }
  return out;
}

function cosineDistance(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i += 1) {
    dot += a[i] * b[i];
  }
  // with unit vectors, cosine similarity is dot product, distance = 1 - sim
  return 1 - dot;
}

function computeAbundance(labels: number[], numPoints: number) {
  const clusterCounts: Record<number, number> = {};
  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i];
    if (label !== -1) {
      clusterCounts[label] = (clusterCounts[label] || 0) + 1;
    }
  }
  const totalNonNoise = Object.values(clusterCounts).reduce((s, c) => s + c, 0);
  const entries = Object.entries(clusterCounts).map(([cluster, countStr]) => {
    const count = Number(countStr);
    const relativeAbundance = totalNonNoise > 0 ? count / totalNonNoise : 0;
    return {
      cluster: Number(cluster),
      count,
      relativeAbundance,
    };
  });
  return {
    summary: entries,
    totalSequences: numPoints,
    clusteredSequences: totalNonNoise,
    noiseSequences: numPoints - totalNonNoise,
  };
}

export async function POST(request: NextRequest) {
  // Auth gate: only authenticated users
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { embeddings, sequence, fasta, pcaComponents, eps, minSamples } = parsed.data;

  try {
    // If sequence or fasta provided, fetch embedding(s) from DNABERT service on server
    let fetchedEmbeddings: number[][] = [];
    if (sequence) {
      const dnabertUrl = process.env.DNABERT_URL || "https://dnabert-service-1019431678774.us-central1.run.app/predict";
      const dnabertRes = await fetch(dnabertUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence }),
        // Next.js fetch is already server-side; keep defaults
      });
      if (!dnabertRes.ok) {
        return NextResponse.json({ error: `DNABERT request failed: ${dnabertRes.status}` }, { status: 502 });
      }
      const dnabertJson = (await dnabertRes.json()) as { embedding?: number[] };
      if (!dnabertJson.embedding || !Array.isArray(dnabertJson.embedding)) {
        return NextResponse.json({ error: "DNABERT response missing embedding" }, { status: 502 });
      }
      fetchedEmbeddings = [dnabertJson.embedding.map((x) => Number(x))];
    } else if (fasta) {
      const dnabertUrl = process.env.DNABERT_URL || "https://dnabert-service-1019431678774.us-central1.run.app/predict";
      const dnabertRes = await fetch(dnabertUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fasta }),
      });
      if (!dnabertRes.ok) {
        return NextResponse.json({ error: `DNABERT request failed: ${dnabertRes.status}` }, { status: 502 });
      }
      const dnabertJson = (await dnabertRes.json()) as { embeddings?: number[][]; embedding?: number[] };
      if (Array.isArray(dnabertJson.embeddings)) {
        fetchedEmbeddings = dnabertJson.embeddings.map((arr) => arr.map((x) => Number(x)));
      } else if (Array.isArray(dnabertJson.embedding)) {
        fetchedEmbeddings = [dnabertJson.embedding.map((x) => Number(x))];
      } else {
        return NextResponse.json({ error: "DNABERT response missing embeddings" }, { status: 502 });
      }
    }

    const dataVectors: number[][] = (() => {
      if (embeddings && embeddings.length) {
        if (!embeddings.every((row) => row.length === embeddings[0].length)) {
          throw new Error("All embedding vectors must have the same length");
        }
        if (fetchedEmbeddings.length) {
          if (!fetchedEmbeddings.every((v) => v.length === embeddings[0].length)) {
            throw new Error("Sequence embedding dimension does not match provided embeddings");
          }
          return [...embeddings, ...fetchedEmbeddings];
        }
        return embeddings;
      }
      if (fetchedEmbeddings.length) return fetchedEmbeddings;
      throw new Error("No embeddings or sequence provided");
    })();

    // Normalize to unit vectors for cosine distance stability
    const unitEmbeddings = toUnitVectors(dataVectors);

    // PCA reduction
    const maxComponents = Math.max(
      1,
      Math.min(unitEmbeddings[0].length, Math.max(1, unitEmbeddings.length - 1), 200),
    );
    const requested = pcaComponents ?? Math.min(20, maxComponents);
    const components = Math.min(maxComponents, Math.max(1, requested));

    const pca = new mlPca.PCA(unitEmbeddings, { center: true, scale: false });
    const reduced = pca.predict(unitEmbeddings, { nComponents: components }).to2DArray();

    // DBSCAN with cosine distance in reduced space (vectors are not necessarily unit-length after PCA)
    // Normalize reduced vectors to unit length before cosine distance.
    const reducedUnit = toUnitVectors(reduced);

    const dbscan = new clustering.DBSCAN();
    const epsilon = eps ?? 0.2; // sensible default for cosine distance on unit vectors
    const minPts = minSamples ?? (unitEmbeddings.length === 1 ? 1 : 2);
    const clusters: number[][] = dbscan.run(reducedUnit, epsilon, minPts, cosineDistance);
    // Compose labels
    const labels: number[] = new Array(reducedUnit.length).fill(-1);
    for (let c = 0; c < clusters.length; c += 1) {
      const indices = clusters[c];
      for (let k = 0; k < indices.length; k += 1) {
        labels[indices[k]] = c;
      }
    }

    const abundance = computeAbundance(labels, reducedUnit.length);

    return NextResponse.json({
      labels,
      clustersCount: clusters.length,
      abundance,
      pcaComponents: components,
      eps: epsilon,
      minSamples: minPts,
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


