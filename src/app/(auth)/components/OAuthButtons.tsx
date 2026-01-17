"use client";
import GoogleLogo from "@/components/icons/google-logo";
import { Button } from "@/components/ui/button";

export default function OAuthButtons() {
  return (
    <Button variant="outline" className="w-full justify-center gap-3">
      <GoogleLogo />
      Continue with Google
    </Button>
  );
}
