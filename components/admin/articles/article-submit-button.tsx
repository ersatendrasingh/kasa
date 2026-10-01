"use client";

import type { ComponentProps, ReactNode } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function ArticleSubmitButton({
  children,
  pendingLabel = "Saving…",
  ...props
}: Omit<ComponentProps<typeof Button>, "children"> & {
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending, data } = useFormStatus();
  const submittedValue = props.name && data ? data.get(String(props.name)) : null;
  const isActive = pending && (!props.name || String(submittedValue) === String(props.value));

  return (
    <Button
      {...props}
      type="submit"
      disabled={pending || props.disabled}
      aria-busy={isActive}
    >
      {isActive ? <LoaderCircleIcon className="animate-spin" /> : null}
      {isActive ? pendingLabel : children}
    </Button>
  );
}
