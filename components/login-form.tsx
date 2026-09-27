import type { ComponentProps } from "react";
import Image from "next/image";
import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type LoginFormProps = ComponentProps<"div"> & {
  action: (formData: FormData) => void | Promise<void>;
  error?: string;
  mode?: "login" | "setup" | "signup";
  audience?: "admin" | "public";
  callbackUrl?: string;
};

export function LoginForm({
  className,
  action,
  error,
  mode = "login",
  audience = "admin",
  callbackUrl = "/",
  ...props
}: LoginFormProps) {
  const isSetup = mode === "setup";
  const isSignup = mode === "signup";
  const isPublic = audience === "public";
  const title = isSetup
    ? "Create admin account"
    : isSignup
      ? "Create your KASA account"
      : isPublic
        ? "Login to KASA"
        : "Welcome back";
  const description = isSetup
    ? "Set up the first KASA administrator"
    : isSignup
      ? "Use one KASA account across community, tools, and future product access."
      : isPublic
        ? "Access your questions, answers, comments, and saved KASA tools from one account."
        : "Login to your KASA admin account";
  const submitLabel = isSetup ? "Create admin" : isSignup ? "Create account" : "Login";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form action={action} className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-balance text-muted-foreground">
                  {description}
                </p>
              </div>

              {error ? (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : null}

              {isSetup || isSignup ? (
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input id="name" name="name" placeholder="Your name" required />
                </Field>
              ) : null}

              <input type="hidden" name="callbackUrl" value={callbackUrl} />

              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder={isPublic ? "you@example.com" : "admin@getkasa.in"}
                  required
                />
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  {!isSetup && !isSignup ? (
                    <Link href="/auth/forgot-password" className="ml-auto text-sm font-semibold text-primary hover:underline">
                      Forgot password?
                    </Link>
                  ) : null}
                  {!isSetup && !isPublic ? (
                    <span className="ml-3 text-sm text-muted-foreground">
                      Admin access
                    </span>
                  ) : null}
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  minLength={isSetup || isSignup ? 8 : undefined}
                  required
                />
              </Field>

              <Field>
                <Button type="submit" className="bg-[image:var(--button-solid)] !text-white shadow-xl shadow-blue-900/18 hover:!text-white hover:opacity-95">
                  {submitLabel}
                </Button>
              </Field>

              {isPublic ? (
                <FieldDescription className="text-center">
                  {isSignup ? "Already have an account?" : "New to KASA?"}{" "}
                  <Link
                    href={`${isSignup ? "/login" : "/signup"}?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                    className="font-semibold text-primary hover:underline"
                  >
                    {isSignup ? "Login" : "Create account"}
                  </Link>
                </FieldDescription>
              ) : null}

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                KASA
              </FieldSeparator>

              <FieldDescription className="text-center">
                {isPublic
                  ? "One account for KASA community, tools, and future workspace access."
                  : "Secure access for content, leads, licenses, and interview Q&A."}
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="/admin-login-panel.svg"
              alt="KASA workspace"
              fill
              sizes="(min-width: 768px) 50vw, 0px"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.45]"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        {isPublic ? "Your KASA account works across eligible public features." : "Protected admin area for the KASA team."}
      </FieldDescription>
    </div>
  );
}
