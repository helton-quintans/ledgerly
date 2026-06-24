"use client";

import { useSearch } from "@/components/search-context";
import { Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { signOut, useSession } from "next-auth/react";

import ThemeToggle from "@/components/theme-toggle";

import { Logo } from "./logo";

export function BrandHeader() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { data: session } = useSession();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { query, setQuery } = useSearch();

  return (
    <header className="fixed z-50 w-full border-b bg-(--color-header) border-(--color-header-border)">
      <div className="flex h-16 items-center justify-between px-2">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="hidden size-8 md:flex"
            onClick={toggleSidebar}
          >
            {isCollapsed ? (
              <Menu className="size-4" />
            ) : (
              <X className="size-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="size-8 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="size-4" />
          </Button>

          <Link href="/" className="flex items-center">
            <Logo />
          </Link>
        </div>

        <div className="hidden items-center space-x-1 md:flex">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search"
                className="h-9 w-64 pl-9"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Search className="absolute top-2.5 left-3 size-4 text-foreground" />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-foreground"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="mr-2 size-4" />
              Search
            </Button>
          )}

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 shadow-sm cursor-pointer">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? undefined}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session?.user?.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email || "email@example.com"}
                </p>
              </div>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                <span className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-2 md:hidden items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-foreground"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="size-8 shadow-sm cursor-pointer">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? undefined}
                />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session?.user?.name?.[0] ?? "?"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || "Usuário"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session?.user?.email || "email@example.com"}
                </p>
              </div>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => signOut()}
              >
                <span className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                  Logout
                </span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-background/90 md:hidden p-4">
            <div className="max-w-full">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search"
                  className="h-11 w-full pl-10"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute top-3 left-3 size-5 text-foreground" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-2"
                  onClick={() => setIsSearchOpen(false)}
                >
                  <X className="size-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
