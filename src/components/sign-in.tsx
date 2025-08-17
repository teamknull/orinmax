"use client"

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { signIn } from "@/lib/auth-client";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    await signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Successfully signed in!");
          router.push("/dashboard");
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-white">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-white/70 hover:text-white underline"
          >
            Forgot your password?
          </Link>
        </div>

        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-white text-slate-900 hover:bg-white/90 transition-colors"
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin mr-2" />
        ) : null}
        Sign In
      </Button>
    </form>
  );
}