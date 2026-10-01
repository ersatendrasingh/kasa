import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/site/seo-page-template";
import { CoachingInstitutesPage } from "@/components/site/solution-pages/coaching-institutes-page";
import { OnlineAcademiesPage } from "@/components/site/solution-pages/online-academies-page";
import { allSolutionPages, getSolutionPage } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return allSolutionPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getSolutionPage(slug);
  if (!page) return {};

  return pageMetadata(page, `/solutions/${slug}`);
}

export default async function SolutionPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSolutionPage(slug);
  if (!page) notFound();

  if (slug === "online-academies") {
    return <OnlineAcademiesPage page={page} />;
  }

  if (slug === "coaching-institutes") {
    return <CoachingInstitutesPage page={page} />;
  }

  return <SeoPageTemplate page={page} />;
}
