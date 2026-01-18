import ShellLayout from "@/layouts/shell-layout";
import { getServerAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export default async function ProtectedShellLayout({
  children,
}: { children: ReactNode }) {
  const session = await getServerAuthSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <ShellLayout>
      {children}
    </ShellLayout>
  )
}
