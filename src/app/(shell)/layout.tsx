import ShellLayout from "@/layouts/shell-layout";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedShellLayout({
  children,
}: { children: ReactNode }) {
  // Server-side check for session cookie
  const c = cookies();
  const session = (await c).get?.("session")?.value ?? null;
  if (!session) {
    redirect("/login");
  }

  return <ShellLayout>{children}</ShellLayout>;
}
