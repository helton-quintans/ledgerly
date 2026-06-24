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
  Table,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/search-input";
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

/**
 * Feature flags to control visibility of modules under development
 * for production rollout and clean UX/UI presentation.
 */
const FEATURE_FLAGS = {
  ENABLE_EXTENDED_MAIN_ITEMS: false,
  ENABLE_CAREER_PILLAR: false,
  ENABLE_TOOLS_ITEMS: false,
};

export function BrandSidebar() {
  const pathname = usePathname();
  const { state, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  function isRouteActive(href: string): boolean {
    return pathname === href;
  }

  function isParentActive(item: NavItem): boolean {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some(
        (child) =>
          pathname === child.href || pathname.startsWith(child.href + "/"),
      );
    }
    return pathname.startsWith(item.href + "/");
  }

  function isChildActive(href: string): boolean {
    return pathname === href || pathname.startsWith(href + "/");
  }

  React.useEffect(() => {
    const autoExpand: Record<string, boolean> = {};

    [...mainNavItems, ...pillarNavItems, ...toolsNavItems].forEach((item) => {
      if (item.children && isParentActive(item)) {
        autoExpand[item.title] = true;
      }
    });

    setExpanded((prev) => ({ ...prev, ...autoExpand }));
  }, [pathname]);

  function toggleExpand(key: string) {
    setExpanded((s) => ({ ...s, [key]: !s[key] }));
  }

  const mainNavItems: NavItem[] = [
    { title: "Home", href: "/", icon: <Home className="size-4" /> },
    ...(FEATURE_FLAGS.ENABLE_EXTENDED_MAIN_ITEMS
      ? [
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
        ]
      : []),
  ];

  const pillarNavItems: NavItem[] = [
    ...(FEATURE_FLAGS.ENABLE_CAREER_PILLAR
      ? [
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
        ]
      : []),
    {
      title: "Health & Wellbeing",
      href: "/health-wellbeing",
      icon: <Heart className="size-4 shrink-0" />,
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

  const toolsNavItems: NavItem[] = FEATURE_FLAGS.ENABLE_TOOLS_ITEMS
    ? [
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
      ]
    : [];

  const q = query.trim().toLowerCase();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="mt-16">
      <SidebarHeader>
        {!isCollapsed && (
          <div className="px-2 pt-2">
            <div className="pb-2">
              <SearchInput
                type="search"
                placeholder="Search"
                className="h-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search sidebar"
              />
            </div>
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
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
                            className={cn(
                              "cursor-pointer",
                              isParentActive(item) &&
                                "bg-sidebar-accent text-sidebar-accent-foreground",
                              isParentActive(item) && "dark:text-gray-900",
                            )}
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
                            isActive={isRouteActive(item.href)}
                            tooltip={item.title}
                            className={cn(
                              isRouteActive(item.href) &&
                                "dark:data-[active=true]:text-gray-900",
                            )}
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
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={isChildActive(child.href)}
                                    className={cn(
                                      isChildActive(child.href) &&
                                        "dark:data-[active=true]:text-gray-900",
                                    )}
                                  >
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
                                  className={cn(
                                    "cursor-pointer",
                                    isParentActive(p) &&
                                      "bg-sidebar-accent text-sidebar-accent-foreground",
                                    isParentActive(p) && "dark:text-gray-900",
                                  )}
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
                                  isActive={isRouteActive(p.href)}
                                  tooltip={p.title}
                                  className={cn(
                                    isRouteActive(p.href) &&
                                      "dark:data-[active=true]:text-gray-900",
                                  )}
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
                                      <SidebarMenuSubButton
                                        asChild
                                        isActive={isChildActive(child.href)}
                                        className={cn(
                                          isChildActive(child.href) &&
                                            "dark:data-[active=true]:text-gray-900",
                                        )}
                                      >
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
                          className={cn(
                            "cursor-pointer",
                            isParentActive(item) &&
                              "bg-sidebar-accent text-sidebar-accent-foreground",
                            isParentActive(item) && "dark:text-gray-900",
                          )}
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
                          isActive={isRouteActive(item.href)}
                          tooltip={item.title}
                          className={cn(
                            isRouteActive(item.href) &&
                              "dark:data-[active=true]:text-gray-900",
                          )}
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
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isChildActive(child.href)}
                                  className={cn(
                                    isChildActive(child.href) &&
                                      "dark:data-[active=true]:text-gray-900",
                                  )}
                                >
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