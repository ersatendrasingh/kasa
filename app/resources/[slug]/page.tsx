import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/site/seo-page-template";
import { StartOnlineAcademyIndiaPage } from "@/components/site/resource-pages/start-online-academy-india-page";
import { getResourcePage, resourcePages } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return resourcePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getResourcePage(slug);
  if (!page) return {};

  return pageMetadata(page, `/resources/${slug}`);
}

export default async function ResourcePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getResourcePage(slug);
  if (!page) notFound();

  if (slug === "start-online-academy-india") {
    return <StartOnlineAcademyIndiaPage page={page} />;
  }

  return <SeoPageTemplate page={page} />;
}
