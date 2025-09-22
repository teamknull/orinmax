import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import ClusterClient from "@/components/cluster-client";
import { DNAHelix } from "@/components/dna-helix";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Analysis Panel */}
          <div className="space-y-4">
            <div className="bg-card border-2 border-border rounded-lg shadow-lg">
              <div className="bg-muted border-b-2 border-border px-4 py-3">
                <h2 className="text-lg font-bold text-card-foreground">SEQUENCE CLUSTERING ANALYSIS</h2>
                <p className="text-sm text-muted-foreground">Environmental DNA sequence analysis using DBSCAN algorithm</p>
              </div>
              <div className="p-4">
                <ClusterClient />
              </div>
            </div>
          </div>

          {/* Right Column - Visualization Panel */}
          <div className="space-y-4">
            <div className="bg-card border-2 border-border rounded-lg shadow-lg">
              <div className="bg-muted border-b-2 border-border px-4 py-3">
                <h2 className="text-lg font-bold text-card-foreground">DNA HELIX VISUALIZATION</h2>
                <p className="text-sm text-muted-foreground">3D molecular structure representation</p>
              </div>
              <div className="p-4">
                <DNAHelix />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
