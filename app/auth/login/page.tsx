import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { loginAction } from "@/actions/auth";
import { LoginForm } from "@/components/login-form";
import { safeRelativePath } from "@/lib/auth/redirects";
import { getCurrentUser, hasAdminUser } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function AuthLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string; reset?: string }>;
}) {
  if (!(await hasAdminUser())) redirect("/auth/setup");
  const params = await searchParams;
  const callbackUrl = safeRelativePath(params.callbackUrl, "/admin");
  const currentUser = await getCurrentUser();

  if (currentUser?.role === UserRole.ADMIN) redirect(callbackUrl);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {params.reset === "success" ? <p className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-800">Password updated. Please sign in.</p> : null}
        <LoginForm
          action={loginAction}
          callbackUrl={callbackUrl}
          error={params.error === "invalid" ? "Email or password is incorrect." : undefined}
        />
      </div>
    </div>
  );
}
