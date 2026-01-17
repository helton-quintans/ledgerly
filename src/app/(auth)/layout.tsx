import { LogoPulse } from "@/components/logo";
import type { ReactNode } from "react";

export const metadata = {
  title: "Login — Ledgerly",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted text-foreground">
      <div className="flex min-h-screen items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm px-2">
          <div className="mb-6 flex justify-center">
            <LogoPulse />
          </div>
          <div className="auth-neon-frame">
            <div className="auth-neon-inner rounded-2xl bg-background/80 p-6 shadow-lg">
              {children}
            </div>
          </div>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
