"use client";

import { useState, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ApiResponse = {
  labels: number[];
  clustersCount: number;
  abundance: {
    summary: { cluster: number; count: number; relativeAbundance: number }[];
    totalSequences: number;
    clusteredSequences: number;
    noiseSequences: number;
  };
  pcaComponents: number;
  eps: number;
  minSamples: number;
};

export default function ClusterClient() {
  const [sequence, setSequence] = useState<string>("");
  const [fasta, setFasta] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<ApiResponse | null>(null);

  async function sendSequence() {
    setError("");
    setResult(null);
    if (!sequence.trim()) {
      setError("Enter a DNA sequence");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/clustering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence, minSamples: 1, pcaComponents: 1 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Request failed");
        return;
      }
      setResult(data as ApiResponse);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function sendFasta() {
    setError("");
    setResult(null);
    if (!fasta.trim()) {
      setError("Enter FASTA content");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/clustering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fasta }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Request failed");
        return;
      }
      setResult(data as ApiResponse);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleFastaFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setFasta(text);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">DNA Sequence</label>
        <Input
          value={sequence}
          onChange={(e) => setSequence(e.target.value)}
          placeholder="Enter DNA sequence"
        />
        <Button onClick={sendSequence} disabled={loading}>
          {loading ? "Clustering..." : "Run Clustering (Sequence)"}
        </Button>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">FASTA (multiple sequences)</label>
        <Input type="file" accept=".fa,.fasta,.txt" onChange={handleFastaFileChange} />
        <textarea
          className="w-full border rounded-md p-2 text-sm bg-background"
          rows={6}
          value={fasta}
          onChange={(e) => setFasta(e.target.value)}
          placeholder={">seq1\nACGT...\n>seq2\nACGT..."}
        />
        <Button onClick={sendFasta} disabled={loading}>
          {loading ? "Clustering..." : "Run Clustering (FASTA)"}
        </Button>
      </div>

      {error && (
        <div className="text-sm text-red-500">{error}</div>
      )}
      {result && (
        <div className="border rounded-md p-3 space-y-2">
          <div className="text-sm">Clusters: <strong>{result.clustersCount}</strong></div>
          <div className="text-sm">Total sequences: {result.abundance.totalSequences}</div>
          <div className="text-sm">Clustered: {result.abundance.clusteredSequences}</div>
          <div className="text-sm">Noise: {result.abundance.noiseSequences}</div>
          <div className="text-sm font-medium mt-2">Abundance</div>
          <ul className="text-sm list-disc pl-5">
            {result.abundance.summary.map((s) => (
              <li key={s.cluster}>Cluster {s.cluster}: count {s.count}, rel {s.relativeAbundance.toFixed(3)}</li>
            ))}
          </ul>
          <div className="text-sm font-medium mt-2">Labels</div>
          <div className="text-xs break-words">{JSON.stringify(result.labels)}</div>
        </div>
      )}
    </div>
  );
}


