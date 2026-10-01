import type { ComponentType, SVGProps } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ArticleSubmitButton } from "@/components/admin/articles/article-submit-button";

type HiddenField = {
  name: string;
  value: string | number | boolean;
};

export function ConfirmActionButton({
  action,
  fields,
  icon: Icon,
  label,
  title,
  description,
  confirmLabel = "Confirm",
  variant = "outline",
  confirmVariant = "default",
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: HiddenField[];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  title: string;
  description: string;
  confirmLabel?: string;
  variant?: "default" | "outline" | "destructive" | "ghost";
  confirmVariant?: "default" | "destructive";
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="button" variant={variant} size="icon" aria-label={label} title={label}>
          <Icon className="size-4" aria-hidden="true" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <form action={action}>
            {fields.map((field) => (
              <input
                key={field.name}
                type="hidden"
                name={field.name}
                value={String(field.value)}
              />
            ))}
            <AlertDialogAction asChild>
              <ArticleSubmitButton
                pendingLabel="Working…"
                className={
                  confirmVariant === "destructive"
                    ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                    : undefined
                }
              >
                {confirmLabel}
              </ArticleSubmitButton>
            </AlertDialogAction>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
