"use client";
import { signIn } from "next-auth/react";

export function OAuthButton({ provider, label }: { provider: string; label: string }) {
  return (
    <button
      onClick={() => signIn(provider)}
      className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 border rounded-md bg-secondary text-foreground"
    >
      {label}
    </button>
  );
}

export default OAuthButton;
