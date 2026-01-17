"use client";
import { Button } from "@/components/ui/button";

export default function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      <Button variant="outline" className="justify-start">
        <span className="mr-3"></span>
        Login with Apple
      </Button>
      <Button variant="outline" className="justify-start">
        <span className="mr-3">G</span>
        Login with Google
      </Button>
    </div>
  );
}
