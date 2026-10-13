import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { publicSignupAction } from "@/actions/auth";
import { LoginForm } from "@/components/login-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type SignupPageProps = {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
};

function safeCallbackUrl(value: string | undefined) {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  return value;
}

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const callbackUrl = safeCallbackUrl(params.callbackUrl);

  if (session?.user?.id) redirect(callbackUrl);

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_22%_18%,rgba(43,168,255,0.22),transparent_26rem),radial-gradient(circle_at_78%_78%,rgba(34,181,115,0.18),transparent_24rem),linear-gradient(135deg,#f8fbff_0%,#eaf5ff_48%,#f5fff9_100%)] p-6 md:p-10">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-[image:var(--button-solid)]" />
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          action={publicSignupAction}
          audience="public"
          callbackUrl={callbackUrl}
          mode="signup"
          error={params.error === "exists" ? "An account already exists with this email. Login instead." : undefined}
        />
      </div>
    </div>
  );
}
