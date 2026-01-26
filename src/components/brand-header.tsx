"use client";

import { useSearch } from "@/components/search-context";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";

import ThemeToggle from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";

import { Logo } from "./logo";

export function BrandHeader() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { query, setQuery } = useSearch();

  return (
    <header className="fixed z-50 w-full border-border border-b bg-background">
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

          <div onMouseEnter={() => setMenuOpen(true)}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Avatar className="size-8 shadow-sm">
                    <AvatarImage
                      src={
                        session?.user?.image ??
                        "https://github.com/helton-quintans.png"
                      }
                      alt={session?.user?.name ?? ""}
                    />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <span className="text-xs">ME</span>
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="size-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <DropdownMenuLabel>
                  {session?.user?.name ?? "Conta"}
                  {session?.user?.email ? (
                    <div className="text-muted-foreground text-xs">
                      {session.user.email}
                    </div>
                  ) : null}
                </DropdownMenuLabel>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={() => signOut({ callbackUrl: "/login" })}
                  data-variant="destructive"
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex items-center gap-2 md:hidden">
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
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2"
              >
                <Avatar className="size-8 shadow-sm">
                  <AvatarImage
                    src={
                      session?.user?.image ??
                      "https://github.com/helton-quintans.png"
                    }
                    alt={session?.user?.name ?? "User"}
                  />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <span className="text-xs">ME</span>
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="size-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                {session?.user?.name ?? "Conta"}
                {session?.user?.email ? (
                  <div className="text-muted-foreground text-xs">
                    {session.user.email}
                  </div>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuItem
                className="cursor-pointer"
                onSelect={() => signOut({ callbackUrl: "/login" })}
                data-variant="destructive"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 bg-background/90 p-4 md:hidden">
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
                  className="absolute top-2 right-2"
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
