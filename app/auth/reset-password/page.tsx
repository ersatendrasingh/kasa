import Link from "next/link";
import { KeyRoundIcon } from "lucide-react";
import { resetPasswordAction } from "@/actions/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export const dynamic = "force-dynamic";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; error?: string }> }) {
  const params = await searchParams;
  const token = String(params.token || "");
  const validTokenShape = /^[A-Za-z0-9_-]{32,200}$/.test(token);
  return (
    <main className="flex min-h-svh items-center justify-center bg-muted p-6 md:p-10">
      <Card className="w-full max-w-md overflow-hidden p-0"><CardContent className="p-6 md:p-8">{!validTokenShape ? <div className="space-y-5 text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-rose-50 text-rose-600"><KeyRoundIcon className="size-6" /></span><h1 className="text-2xl font-bold">This reset link is invalid</h1><p className="text-sm leading-6 text-muted-foreground">Request a new link and use it within one hour.</p><Button asChild className="w-full"><Link href="/auth/forgot-password">Request a new link</Link></Button></div> : <form action={resetPasswordAction}><FieldGroup>
        <div className="text-center"><span className="mx-auto grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary"><KeyRoundIcon className="size-6" /></span><h1 className="mt-4 text-2xl font-bold">Choose a new password</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Use at least eight characters. This will sign out other active sessions.</p></div>
        {params.error === "invalid-password" ? <Alert variant="destructive"><AlertDescription>Use matching passwords with at least eight characters.</AlertDescription></Alert> : null}
        <input type="hidden" name="token" value={token} />
        <Field><FieldLabel htmlFor="password">New password</FieldLabel><Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <Field><FieldLabel htmlFor="confirmPassword">Confirm new password</FieldLabel><Input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" minLength={8} required /></Field>
        <Field><Button type="submit" className="w-full bg-[image:var(--button-solid)] !text-white">Save new password</Button></Field>
        <FieldDescription className="text-center"><Link href="/auth/login" className="font-semibold text-primary hover:underline">Back to login</Link></FieldDescription>
      </FieldGroup></form>}</CardContent></Card>
    </main>
  );
}
