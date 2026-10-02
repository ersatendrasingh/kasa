import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/site/seo-page-template";
import { StartOnlineAcademyIndiaPage } from "@/components/site/resource-pages/start-online-academy-india-page";
import { SellRecordedCoursesOnlinePage } from "@/components/site/resource-pages/sell-recorded-courses-online-page";
import { RunLiveOnlineClassesPage } from "@/components/site/resource-pages/run-live-online-classes-page";
import { LmsSeoForAcademiesPage } from "@/components/site/resource-pages/lms-seo-for-academies-page";
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

  if (slug === "sell-recorded-courses-online") {
    return <SellRecordedCoursesOnlinePage page={page} />;
  }

  if (slug === "run-live-online-classes") {
    return <RunLiveOnlineClassesPage page={page} />;
  }

  if (slug === "lms-seo-for-academies") {
    return <LmsSeoForAcademiesPage page={page} />;
  }

  return <SeoPageTemplate page={page} />;
}
