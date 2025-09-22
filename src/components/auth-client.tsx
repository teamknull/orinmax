"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SignIn from "@/components/sign-in";
import SignUp from "@/components/sign-up";

type AuthMode = "signin" | "signup";

export default function AuthClient() {
  const [mode, setMode] = useState<AuthMode>("signin");

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-2 border-border rounded-lg shadow-lg">
          <div className="bg-muted border-b-2 border-border px-6 py-4">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <div className="bg-[hsl(var(--gov-blue))] px-2 py-1 rounded-sm">
                  <span className="font-bold text-white text-xs">Team Knull</span>
                </div>
                <h1 className="text-lg font-bold text-card-foreground">ORIONPACK</h1>
              </div>
              <p className="text-sm text-muted-foreground">Environmental DNA Analysis System</p>
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex bg-muted rounded-lg p-1">
                <Button
                  variant="ghost"
                  className={cn(
                    "flex-1 text-sm font-medium transition-all duration-200",
                    mode === "signin"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
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
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>

            <div className="bg-muted border border-border rounded-lg p-4">
              {mode === "signin" ? <SignIn /> : <SignUp />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
