"use client";

import { useSearchParams } from "next/navigation";
import OAuthButtons from "../components/OAuthButtons";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  function getErrorMessage(error: string | null) {
  if (error === "OAuthAccountNotLinked") {
    return "An account with this email already exists. Please login with your email and password, then link your Google account in your profile settings.";
  }
  return null;
}
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const errorMessage = getErrorMessage(error);
  return (
    <div>
      <div className="space-y-4">
        <h2 className="text-center font-semibold text-lg">Welcome back</h2>
        <p className="text-center text-muted-foreground text-sm">
          Login with your Google account
        </p>
      </div>

      <div className="mt-6 space-y-4">
        {errorMessage && (
          <div className="text-center text-sm text-destructive" role="alert">
            {errorMessage}
          </div>
        )}
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
