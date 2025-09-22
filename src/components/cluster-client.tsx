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
      const fastaPayload = fasta.replace(/\r\n/g, "\n");
      const res = await fetch("/api/clustering", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fasta: fastaPayload }),
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
    <div className="space-y-6">
      {/* Single Sequence Input */}
      <div className="space-y-4">
        <div className="border-l-4 border-primary pl-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Single Sequence Analysis
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Enter a single DNA sequence for clustering analysis
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            DNA Sequence
          </label>
          <Input
            value={sequence}
            onChange={(e) => setSequence(e.target.value.toUpperCase())}
            placeholder="Enter DNA sequence (e.g., ATCGATCGATCG)"
            className="font-mono text-sm border-border"
          />
          <Button
            onClick={sendSequence}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {loading ? "Processing..." : "Run Clustering Analysis"}
          </Button>
        </div>
      </div>

      {/* FASTA File Input */}
      <div className="space-y-4">
        <div className="border-l-4 border-secondary pl-4">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Multiple Sequence Analysis (FASTA)
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a FASTA file or paste multiple sequences for batch analysis
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">
            Upload FASTA File
          </label>
          <Input
            type="file"
            accept=".fa,.fasta,.txt"
            onChange={handleFastaFileChange}
            className="border-border"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Or paste FASTA content
            </label>
            <textarea
              className="w-full border border-border rounded-md p-3 text-sm bg-background font-mono text-foreground resize-y min-h-24"
              rows={6}
              value={fasta}
              onChange={(e) => setFasta(e.target.value)}
              placeholder={">sequence_1\nACGTACGTACGTACGTACGT\n>sequence_2\nTCAGTCAGTCAGTCAGTCAG\n>sequence_3\nGCTAGCTAGCTAGCTAGCTA"}
            />
          </div>

          <Button
            onClick={sendFasta}
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
          >
            {loading ? "Processing..." : "Analyze FASTA Sequences"}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Analysis Error
              </h3>
              <div className="mt-2 text-sm text-destructive">
                {error}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Display */}
      {result && (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-card-foreground">
              Analysis Results
            </h3>
            <button
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              className="inline-flex items-center px-3 py-1 rounded-md text-sm font-medium text-primary bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy JSON
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-muted p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-primary">{result.clustersCount}</div>
              <div className="text-sm text-muted-foreground">Clusters</div>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-chart-1">{result.abundance.totalSequences}</div>
              <div className="text-sm text-muted-foreground">Total Sequences</div>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-chart-2">{result.abundance.clusteredSequences}</div>
              <div className="text-sm text-muted-foreground">Clustered</div>
            </div>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <div className="text-2xl font-bold text-chart-3">{result.abundance.noiseSequences}</div>
              <div className="text-sm text-muted-foreground">Noise</div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-md font-semibold text-card-foreground mb-3">
                Cluster Abundance
              </h4>
              <div className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-border">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cluster</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Count</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Relative Abundance</th>
                      </tr>
                    </thead>
                    <tbody className="bg-card divide-y divide-border">
                      {result.abundance.summary.map((s) => (
                        <tr key={s.cluster} className="hover:bg-muted/50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-card-foreground">{s.cluster}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{s.count}</td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{s.relativeAbundance.toFixed(4)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-md font-semibold text-card-foreground mb-3">
                Sequence Labels
              </h4>
              <div className="bg-muted border border-border rounded-lg p-4">
                <pre className="text-xs text-foreground whitespace-pre-wrap font-mono">
                  {JSON.stringify(result.labels, null, 2)}
                </pre>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted-foreground">
              <div className="bg-muted p-3 rounded-lg">
                <span className="font-medium text-foreground">PCA Components:</span> {result.pcaComponents}
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <span className="font-medium text-foreground">Epsilon:</span> {result.eps}
              </div>
              <div className="bg-muted p-3 rounded-lg">
                <span className="font-medium text-foreground">Min Samples:</span> {result.minSamples}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




