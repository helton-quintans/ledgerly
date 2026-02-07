import { LogoPulse } from "@/components/logo";
import { ColorBends } from "@ledgerly/ui";
import type { ReactNode } from "react";

export const metadata = {
  title: "Login — Ledgerly",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-black text-foreground relative overflow-hidden">
      {/* ColorBends Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ColorBends
          colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
          rotation={0}
          speed={0.3}
          scale={0.8}
          frequency={1.2}
          warpStrength={1.2}
          mouseInfluence={0.8}
          parallax={0.5}
          noise={0.1}
          transparent={false}
          autoRotate={0.15}
          className="pointer-events-auto"
        />
      </div>
      
      {/* Content */}
      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-4 pointer-events-none">
        <div className="w-full max-w-sm px-2 pointer-events-auto">
          <div className="mb-6 flex max-h-10 justify-center">
            <LogoPulse />
          </div>
          <div className="rounded-2xl bg-white/95 backdrop-blur-sm border border-gray-200/50 p-6 shadow-2xl text-gray-900">
            {children}
          </div>
          <p className="mt-6 text-center text-white/80 text-sm backdrop-blur-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
