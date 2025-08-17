import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers()
  });
  
  if (!session) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome, {session.user.name}!
              </h1>
              <p className="text-white/70">
                You are successfully signed in to Sunx
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
                className="border-white/20 text-white hover:bg-white/10"
              >
                Sign Out
              </Button>
            </form>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">User Information</h3>
              <div className="space-y-2 text-white/80">
                <p><strong>Name:</strong> {session.user.name}</p>
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>User ID:</strong> {session.user.id}</p>
                <p><strong>Email Verified:</strong> {session.user.emailVerified ? "Yes" : "No"}</p>
                <p><strong>Created:</strong> {new Date(session.user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Session Information</h3>
              <div className="space-y-2 text-white/80">
                <p><strong>Session ID:</strong> {session.session.id}</p>
                <p><strong>Expires:</strong> {new Date(session.session.expiresAt).toLocaleString()}</p>
                <p><strong>IP Address:</strong> {session.session.ipAddress || "Not available"}</p>
                <p><strong>User Agent:</strong> {session.session.userAgent || "Not available"}</p>
              </div>
            </div>
          </div>
          
          {session.user.image && (
            <div className="mt-6 bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-2">Profile Image</h3>
              <img 
                src={session.user.image} 
                alt="Profile" 
                className="w-20 h-20 rounded-full object-cover border-2 border-white/20"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
