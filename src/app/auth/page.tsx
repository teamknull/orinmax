"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";

type AuthMode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<AuthMode>("signin");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="w-full max-w-md">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-center text-2xl font-bold text-white mb-2">
              Welcome to Sunx
            </CardTitle>
            
            {/* Tab Navigation */}
            <div className="flex bg-white/10 rounded-lg p-1">
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 text-sm font-medium transition-all duration-200",
                  mode === "signin"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setMode("signin")}
              >
                Sign In
              </Button>
              <Button
                variant="ghost"
                className={cn(
                  "flex-1 text-sm font-medium transition-all duration-200",
                  mode === "signup"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                )}
                onClick={() => setMode("signup")}
              >
                Sign Up
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {mode === "signin" ? <SignIn /> : <SignUp />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
