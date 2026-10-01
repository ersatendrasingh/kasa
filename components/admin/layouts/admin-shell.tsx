import { Suspense, type ReactNode } from "react";
import { AdminNavigationProgress } from "@/components/admin/admin-navigation-progress";
import { AppSidebar } from "@/components/app-sidebar";
import { AdminThemeToggle } from "@/components/admin/theme-toggle";
import { AdminTopNavUser } from "@/components/admin/top-nav-user";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export function AdminShell({
  children,
  adminName,
  adminEmail,
  pageTitle = "Overview",
  pageDescription = "Manage KASA content, operations, licenses, leads, and student growth tools from one workspace.",
  pageEyebrow = "Admin workspace",
  actions,
  showHero = true,
  headerContent,
}: {
  children: ReactNode;
  adminName: string;
  adminEmail: string;
  pageTitle?: string;
  pageDescription?: string;
  pageEyebrow?: string;
  actions?: ReactNode;
  showHero?: boolean;
  headerContent?: ReactNode;
}) {
  return (
    <SidebarProvider>
      <Suspense fallback={null}>
        <AdminNavigationProgress />
      </Suspense>
      <AppSidebar admin={{ name: adminName, email: adminEmail }} />
      <SidebarInset className="admin-shell min-h-svh min-w-0">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-[color:var(--header-border)] bg-[color:var(--header-background)]/95 backdrop-blur-xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-14">
          <div className="flex min-w-0 flex-1 items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            {headerContent ? (
              <div className="min-w-0">{headerContent}</div>
            ) : (
              <div className="min-w-0">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--button-outline-foreground)]">
                  {pageEyebrow}
                </p>
                <p className="hidden truncate text-sm text-muted-foreground sm:block">
                  {pageDescription}
                </p>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 px-4">
            <AdminThemeToggle />
            <AdminTopNavUser
              user={{ name: adminName, email: adminEmail, avatar: "" }}
            />
          </div>
        </header>
        <main className="flex min-w-0 flex-1 flex-col gap-5 p-4 md:p-6">
          {showHero ? (
            <section className="admin-hero rounded-2xl p-5 md:p-7">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <p className="mb-3 w-fit rounded-full border border-[color:var(--button-outline-border)] bg-white/60 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[color:var(--button-outline-foreground)] dark:bg-white/5">
                    {pageEyebrow}
                  </p>
                  <h1 className="font-heading text-3xl font-semibold tracking-normal text-foreground md:text-4xl">
                    {pageTitle}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base">
                    {pageDescription}
                  </p>
                </div>
                {actions ? (
                  <div className="flex flex-wrap items-center gap-2 xl:justify-end">
                    {actions}
                  </div>
                ) : null}
              </div>
            </section>
          ) : null}
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
