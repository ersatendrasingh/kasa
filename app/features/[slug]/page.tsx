import { notFound } from "next/navigation";
import { CourseSellingPlatformPage } from "@/components/site/feature-pages/course-selling-platform-page";
import { ExamsAssignmentsCertificatesPage } from "@/components/site/feature-pages/exams-assignments-certificates-page";
import { LiveClassManagementPage } from "@/components/site/feature-pages/live-class-management-page";
import { SeoPageTemplate } from "@/components/site/seo-page-template";
import { featurePages, getFeaturePage } from "@/lib/site-content";
import { pageMetadata } from "@/lib/seo";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return featurePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const page = getFeaturePage(slug);
  if (!page) return {};

  return pageMetadata(page, `/features/${slug}`);
}

export default async function FeaturePage({ params }: PageProps) {
  const { slug } = await params;
  const page = getFeaturePage(slug);
  if (!page) notFound();

  if (slug === "course-selling-platform") {
    return <CourseSellingPlatformPage page={page} />;
  }

  if (slug === "live-class-management") {
    return <LiveClassManagementPage page={page} />;
  }

  if (slug === "exams-assignments-certificates") {
    return <ExamsAssignmentsCertificatesPage page={page} />;
  }

  return <SeoPageTemplate page={page} />;
}
