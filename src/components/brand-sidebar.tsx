"use client";

import {
  AlertTriangle,
  BarChart2,
  Briefcase,
  ChevronDown,
  Clock,
  Database,
  DollarSign,
  Heart,
  Home,
  LayoutGrid,
  MessageSquareText,
  Plus,
  Search,
  Table,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@ledgerly/utils";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode | null;
  badge?: {
    text: string;
  };
  children?: { title: string; href: string }[];
}

export function BrandSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function toggleExpand(key: string) {
    setExpanded((s) => ({ ...s, [key]: !s[key] }));
  }

  // Menus essenciais (enxuto)
  const mainNavItems: NavItem[] = [
    { title: "Home", href: "/", icon: <Home className="size-4" /> },
    // Pillars will be rendered separately below Home
    {
      title: "Projects",
      href: "/projects",
      icon: <LayoutGrid className="size-4" />,
      children: [
        { title: "Alpha", href: "/projects/alpha" },
        { title: "Beta", href: "/projects/beta" },
      ],
    },
    {
      title: "Databases",
      href: "/databases",
      icon: <Database className="size-4" />,
    },
    {
      title: "Tables",
      href: "/tables",
      icon: <Table className="size-4" />,
      badge: { text: "Beta" },
    },
  ];

  const pillarNavItems: NavItem[] = [
    {
      title: "Career",
      href: "/career",
      icon: <Briefcase className="size-4" />,
      children: [
        { title: "Overview", href: "/career/overview" },
        { title: "Goals", href: "/career/goals" },
        { title: "Tasks", href: "/career/tasks" },
      ],
    },
    {
      title: "Health & Wellbeing",
      href: "/health-wellbeing",
      icon: <Heart className="size-4" />,
      children: [
        { title: "Overview", href: "/health-wellbeing/overview" },
        { title: "Habits", href: "/health-wellbeing/habits" },
        { title: "Activity Log", href: "/health-wellbeing/activity" },
      ],
    },
    {
      title: "Finance",
      href: "/finance",
      icon: <DollarSign className="size-4" />,
      children: [
        { title: "Overview", href: "/finance/overview" },
        { title: "Budget", href: "/finance/budget" },
        { title: "Transactions", href: "/finance/transactions" },
      ],
    },
  ];

  const toolsNavItems: NavItem[] = [
    {
      title: "Alerts",
      href: "/alerts",
      icon: <AlertTriangle className="size-4" />,
    },
    {
      title: "Analytics",
      href: "/analytics",
      icon: <BarChart2 className="size-4" />,
      children: [
        { title: "Live", href: "/analytics/live" },
        { title: "Reports", href: "/analytics/reports" },
      ],
    },
    { title: "History", href: "/history", icon: <Clock className="size-4" /> },
    {
      title: "AI",
      href: "/ai",
      icon: <MessageSquareText className="size-4" />,
    },
  ];

  const q = query.trim().toLowerCase();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="mt-16">
      <SidebarHeader>
        <div className={cn(isCollapsed ? "py-2" : "p-2")}>
          <Button className={cn(isCollapsed ? "h-8 w-8 p-0" : "w-full")}>
            <Plus className={cn("size-4", !isCollapsed && "mr-1")} />
            {!isCollapsed && <span>Create</span>}
          </Button>
        </div>

        {!isCollapsed && (
          <div className="px-2 pt-2">
            <div className="pb-2 relative">
              <Search className="absolute left-3 top-2.5 size-4 text-foreground" />
              <Input
                type="search"
                placeholder="Search"
                className="h-8 pl-9"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search sidebar"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        {/* Main Nav Items */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems
                .filter((item) => {
                  if (!q) return true;
                  if (item.title.toLowerCase().includes(q)) return true;
                  if (item.children) {
                    return item.children.some((c) =>
                      c.title.toLowerCase().includes(q),
                    );
                  }
                  return false;
                })
                .map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const childMatches = hasChildren
                    ? item.children!.some((c) =>
                        c.title.toLowerCase().includes(q),
                      )
                    : false;
                  const isOpen =
                    Boolean(expanded[item.title]) || (!!q && childMatches);

                  return (
                    <React.Fragment key={item.href}>
                      <SidebarMenuItem key={item.href}>
                        {hasChildren ? (
                          <SidebarMenuButton
                            asChild
                            className="cursor-pointer"
                            tooltip={item.title}
                          >
                            <button
                              type="button"
                              onClick={() => toggleExpand(item.title)}
                              aria-expanded={isOpen}
                              className="flex w-full items-center justify-between gap-2"
                            >
                              <span className="flex items-center gap-2">
                                {item.icon}
                                <span>{item.title}</span>
                              </span>
                              <ChevronDown
                                className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                              />
                            </button>
                          </SidebarMenuButton>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href}
                            tooltip={item.title}
                          >
                            <Link
                              href={item.href}
                              onClick={() => {
                                setOpenMobile(false);
                              }}
                            >
                              {item.icon}
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        )}

                        {hasChildren && isOpen && (
                          <SidebarMenuSub>
                            {item
                              .children!.filter((c) => {
                                if (!q) return true;
                                return c.title.toLowerCase().includes(q);
                              })
                              .map((child) => (
                                <SidebarMenuSubItem key={child.href}>
                                  <SidebarMenuSubButton asChild>
                                    <Link
                                      href={child.href}
                                      onClick={() => {
                                        setOpenMobile(false);
                                      }}
                                    >
                                      {child.title}
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                          </SidebarMenuSub>
                        )}

                        {item.badge && (
                          <SidebarMenuBadge>{item.badge.text}</SidebarMenuBadge>
                        )}
                      </SidebarMenuItem>

                      {item.title === "Home" &&
                        // Insert pillar menus immediately after Home
                        pillarNavItems.map((p) => {
                          const pHasChildren = Boolean(p.children?.length);
                          const pChildMatches = pHasChildren
                            ? p.children!.some((c) =>
                                c.title.toLowerCase().includes(q),
                              )
                            : false;
                          const pIsOpen =
                            Boolean(expanded[p.title]) ||
                            (!!q && pChildMatches);

                          return (
                            <SidebarMenuItem key={p.href}>
                              {pHasChildren ? (
                                <SidebarMenuButton
                                  asChild
                                  className="cursor-pointer"
                                  tooltip={p.title}
                                >
                                  <button
                                    type="button"
                                    onClick={() => toggleExpand(p.title)}
                                    aria-expanded={pIsOpen}
                                    className="flex w-full items-center justify-between gap-2"
                                  >
                                    <span className="flex items-center gap-2">
                                      {p.icon}
                                      <span>{p.title}</span>
                                    </span>
                                    <ChevronDown
                                      className={`size-4 transition-transform ${pIsOpen ? "rotate-180" : ""}`}
                                    />
                                  </button>
                                </SidebarMenuButton>
                              ) : (
                                <SidebarMenuButton
                                  asChild
                                  isActive={pathname === p.href}
                                  tooltip={p.title}
                                >
                                  <Link
                                    href={p.href}
                                    onClick={() => setOpenMobile(false)}
                                  >
                                    {p.icon}
                                    <span>{p.title}</span>
                                  </Link>
                                </SidebarMenuButton>
                              )}

                              {pHasChildren && pIsOpen && (
                                <SidebarMenuSub>
                                  {p.children!.map((child) => (
                                    <SidebarMenuSubItem key={child.href}>
                                      <SidebarMenuSubButton asChild>
                                        <Link
                                          href={child.href}
                                          onClick={() => setOpenMobile(false)}
                                        >
                                          {child.title}
                                        </Link>
                                      </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                  ))}
                                </SidebarMenuSub>
                              )}
                            </SidebarMenuItem>
                          );
                        })}
                    </React.Fragment>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Tools Group (accordion) */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {toolsNavItems
                .filter((item) => {
                  if (!q) return true;
                  if (item.title.toLowerCase().includes(q)) return true;
                  if (item.children) {
                    return item.children.some((c) =>
                      c.title.toLowerCase().includes(q),
                    );
                  }
                  return false;
                })
                .map((item) => {
                  const hasChildren = Boolean(item.children?.length);
                  const childMatches = hasChildren
                    ? item.children!.some((c) =>
                        c.title.toLowerCase().includes(q),
                      )
                    : false;
                  const isOpen =
                    Boolean(expanded[item.title]) || (!!q && childMatches);

                  return (
                    <SidebarMenuItem key={item.href}>
                      {hasChildren ? (
                        <SidebarMenuButton
                          asChild
                          className="cursor-pointer"
                          tooltip={item.title}
                        >
                          <button
                            type="button"
                            onClick={() => toggleExpand(item.title)}
                            aria-expanded={isOpen}
                            className="flex w-full items-center justify-between gap-2"
                          >
                            <span className="flex items-center gap-2">
                              {item.icon}
                              <span>{item.title}</span>
                            </span>
                            <ChevronDown
                              className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </button>
                        </SidebarMenuButton>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                          tooltip={item.title}
                        >
                          <Link
                            href={item.href}
                            onClick={() => {
                              setOpenMobile(false);
                            }}
                          >
                            {item.icon}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}

                      {hasChildren && isOpen && (
                        <SidebarMenuSub>
                          {item
                            .children!.filter((c) => {
                              if (!q) return true;
                              return c.title.toLowerCase().includes(q);
                            })
                            .map((child) => (
                              <SidebarMenuSubItem key={child.href}>
                                <SidebarMenuSubButton asChild>
                                  <Link
                                    href={child.href}
                                    onClick={() => {
                                      setOpenMobile(false);
                                    }}
                                  >
                                    {child.title}
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                        </SidebarMenuSub>
                      )}

                      {item.badge && (
                        <SidebarMenuBadge>{item.badge.text}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
