"use client";

import OAuthButtons from "../components/OAuthButtons";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-center font-semibold text-lg">Welcome back</h2>
        <p className="text-center text-muted-foreground text-sm">
          Login with your Google account
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <OAuthButtons />

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-muted-foreground/30" />
          <span className="text-muted-foreground text-xs">
            Or continue with
          </span>
          <div className="h-px flex-1 bg-muted-foreground/30" />
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
