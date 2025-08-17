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
import Form from "next/form";

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
    <Form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="m@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-foreground">
            Password
          </Label>
          <Link
            href="/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground underline"
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
          className="bg-background/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-border"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin mr-2" />
        ) : null}
        Sign In
      </Button>
    </Form>
  );
}