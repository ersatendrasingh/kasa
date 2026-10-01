"use client";

import { LoaderCircleIcon, StarIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

function ToggleButton({ featured }: { featured: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      variant="outline"
      size="icon"
      disabled={pending}
      aria-busy={pending}
      className={featured ? "h-8 w-8 bg-blue-50 text-primary" : "h-8 w-8 bg-white"}
      aria-label={featured ? "Remove featured status" : "Mark as featured"}
      title={featured ? "Remove featured status" : "Mark as featured"}
    >
      {pending ? <LoaderCircleIcon className="size-4 animate-spin" /> : <StarIcon className={featured ? "size-4 fill-current" : "size-4"} />}
    </Button>
  );
}

export function ArticleFeatureToggle({
  action,
  articleId,
  featured,
}: {
  action: (formData: FormData) => void | Promise<void>;
  articleId: string;
  featured: boolean;
}) {
  return (
    <form action={action}>
      <input type="hidden" name="id" value={articleId} />
      <input type="hidden" name="featured" value={featured ? "false" : "true"} />
      <ToggleButton featured={featured} />
    </form>
  );
}
