import React, { type ReactNode } from "react";

import { BrandHeader } from "@/components/brand-header";
import { BrandSidebar } from "@/components/brand-sidebar";
import { SearchProvider } from "@/components/search-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function ShellLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <BrandHeader />
        <BrandSidebar />
        <main className="mt-16 flex w-full justify-center">
          <div className="container">{children}</div>
        </main>
        <Toaster />
      </SearchProvider>
    </SidebarProvider>
  );
}
