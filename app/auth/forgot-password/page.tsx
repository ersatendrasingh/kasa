import Link from "next/link";
import { MailCheckIcon } from "lucide-react";
import { requestPasswordResetAction } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string; delivery?: string; error?: string }> }) {
  const params = await searchParams;
  const sent = params.sent === "1";
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <Card className="w-full max-w-md overflow-hidden p-0"><CardContent className="p-6 md:p-8"><form action={requestPasswordResetAction}><FieldGroup>
        <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><MailCheckIcon className="size-6" /></span><h1 className="mt-4 text-2xl font-bold">Reset your password</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Enter your account email and we will send a one-time reset link.</p></div>
        {sent ? <Alert><AlertDescription>{params.delivery === "local" ? "A reset link was prepared. In local development, it is printed in the terminal because email delivery is not configured." : "If an account exists for that email, a reset link is on its way."}</AlertDescription></Alert> : null}
        {params.error === "expired" ? <Alert variant="destructive"><AlertDescription>This reset link has expired or was already used. Request a new one.</AlertDescription></Alert> : null}
        {params.error === "invalid-email" ? <Alert variant="destructive"><AlertDescription>Enter a valid email address.</AlertDescription></Alert> : null}
        <Field><FieldLabel htmlFor="email">Email address</FieldLabel><Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required /></Field>
        <Field><Button type="submit" className="w-full bg-[image:var(--button-solid)] !text-white">Send reset link</Button></Field>
        <FieldDescription className="text-center"><Link href="/auth/login" className="font-semibold text-primary hover:underline">Back to login</Link></FieldDescription>
      </FieldGroup></form></CardContent></Card>
    </main>
  );
}
