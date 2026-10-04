"use client";

import type * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileTextIcon,
  FileQuestionIcon,
  ChartNoAxesCombinedIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  MessageCircleMoreIcon,
  PackageIcon,
  Settings2Icon,
  UsersIcon,
} from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

export function AppSidebar({
  admin,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  admin: { name: string; email: string };
}) {
  return (
    <Sidebar collapsible="icon" className="border-sidebar-border" {...props}>
      <SidebarHeader className="border-b border-sidebar-border p-3 group-data-[collapsible=icon]:p-1.5">
        <Link
          href="/admin"
          className="flex min-h-11 items-center gap-3 rounded-xl px-2 text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border bg-white/80 shadow-sm dark:bg-white/5">
            <Image
              src="/kasa-icon-192.png"
              alt="KASA"
              width={24}
              height={24}
              className="size-6 object-contain"
            />
          </span>
          <span className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
            <span className="font-heading text-lg font-semibold tracking-normal text-sidebar-foreground">
              KASA
            </span>
            <span className="text-xs text-sidebar-foreground/64">Admin workspace</span>
          </span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          label="Workspace"
          items={[
            {
              title: "Overview",
              url: "/admin",
              icon: <LayoutDashboardIcon />,
            },
            {
              title: "Interview Q&A",
              url: "/admin/interviews",
              icon: <FileQuestionIcon />,
            },
            {
              title: "Articles",
              url: "/admin/articles",
              icon: <FileTextIcon />,
            },
            {
              title: "Comments",
              url: "/admin/comments",
              icon: <MessageCircleMoreIcon />,
            },
            {
              title: "Leads",
              url: "/admin/leads",
              icon: <UsersIcon />,
            },
            {
              title: "ATS analytics",
              url: "/admin/ats-checker",
              icon: <ChartNoAxesCombinedIcon />,
            },
            {
              title: "Licenses",
              url: "/admin/licenses",
              icon: <KeyRoundIcon />,
            },
            {
              title: "Products",
              url: "/admin/licenses/products",
              icon: <PackageIcon />,
            },
            {
              title: "Settings",
              url: "/admin/settings",
              icon: <Settings2Icon />,
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-3 group-data-[collapsible=icon]:p-2">
        <NavUser
          user={{
            name: admin.name,
            email: admin.email,
            avatar: "",
          }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
