import type { Metadata } from "next";
import type { PageSummary } from "@/lib/site-content";
import { industrySeoPageContent } from "@/lib/industry-page-content";
import seoPageContent from "@/lib/seo-page-content.json";

const SITE_URL = "https://www.getkasa.in";

type SeoContent = {
  image?: string;
  imageAlt?: string;
};

const enrichedPages = {
  ...(seoPageContent as unknown as Record<string, SeoContent>),
  ...(industrySeoPageContent as Record<string, SeoContent>),
};

export function pageMetadata(page: PageSummary, pathname: string): Metadata {
  const url = `${SITE_URL}${pathname}`;
  const enriched = enrichedPages[page.slug];
  const image = enriched?.image ?? "/kasa-hero.png";
  const imageAlt = enriched?.imageAlt ?? page.title;
  const searchTitle = sentenceCase(page.keywords[0] ?? page.eyebrow);

  return {
    title: searchTitle,
    description: page.description,
    alternates: {
      canonical: pathname,
    },
    openGraph: {
      type: "website",
      url,
      title: searchTitle,
      description: page.description,
      siteName: "KASA",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: searchTitle,
      description: page.description,
      images: [image],
    },
  };
}

function sentenceCase(value: string) {
  return value ? `${value[0].toUpperCase()}${value.slice(1)}` : value;
}
