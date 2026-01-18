import ShellLayout from "@/layouts/shell-layout";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

// Force dynamic rendering so we only fetch the session at request time, keeping the build static-friendly.
export const dynamic = "force-dynamic";

export default async function ProtectedShellLayout({
  children,
}: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return <ShellLayout>{children}</ShellLayout>;
}
