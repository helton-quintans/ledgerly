"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { GoogleLogo } from "@ledgerly/ui";
import { LogoSpinner } from "@ledgerly/ui/components/logo";

export default function OAuthButtons() {
  const [loading, setLoading] = useState(false);

  async function handleGoogle() {
    setLoading(true);
    try {
      await signIn("google", {
        callbackUrl: "/",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      className="w-full justify-center gap-3"
      onClick={handleGoogle}
      disabled={loading}
    >
      {loading ? (
        <LogoSpinner />
      ) : (
        <>
          <GoogleLogo /> Continue with Google
        </>
      )}
    </Button>
  );
}
