import { auth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  return (
    <div className="bg-card text-card-foreground border-b-2 border-border">
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[hsl(var(--gov-blue))] px-3 py-2 rounded-sm">
              <span className="font-bold text-sm text-white">Team Knull</span>
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-wide text-foreground">ORIONPACK</h1>
              <p className="text-muted-foreground text-xs">Environmental DNA Analysis System</p>
            </div>
          </div>

          {session && (
            <div className="flex items-center space-x-4">
              <div className="text-right text-muted-foreground">
                <div className="text-sm text-foreground">Researcher: {session.user.name}</div>
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
                  className="border-border text-muted-foreground hover:bg-muted hover:text-foreground font-semibold px-4 py-2"
                >
                  LOGOUT
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
