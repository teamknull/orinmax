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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-card/50 backdrop-blur-sm border-border/50 rounded-lg p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-muted-foreground">
                You are successfully signed in to orionmax
              </p>
            </div>
            <form action={async () => {
              "use server";
              await auth.api.signOut({
                headers: await headers()
              });
              redirect("/auth");
            }}>
              <Button 
                type="submit"
                variant="outline" 
                className="border-border/50 text-foreground hover:bg-muted"
              >
                Sign Out
              </Button>
            </form>
          </div>
          
          <div className="grid gap-6 md:grid-cols-1">
            
            <div className="bg-muted/50 rounded-lg p-4 border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-2">Clustering</h3>
            <ClusterClient />
            </div>
          </div>

          <DNAHelix />

        </div>
      </div>
    </div>
  );
}
