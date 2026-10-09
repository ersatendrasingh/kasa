import { DeliveryModelsSection } from "@/components/site/delivery-models-section";
import { FaqSection } from "@/components/site/faq-section";
import { FeatureShowcaseSection } from "@/components/site/feature-showcase-section";
import { HomeHero } from "@/components/site/home-hero";
import { InfrastructureSection } from "@/components/site/infrastructure-section";
import { LatestArticlesSection } from "@/components/site/latest-articles-section";
import { ProductArchitectureSection } from "@/components/site/product-architecture-section";
import { RelatedToolsBlock } from "@/components/site/related-tools-block";
import { SolutionsSection } from "@/components/site/solutions-section";
import { TestimonialsSection } from "@/components/site/testimonials-section";
import { TrustedLogoStrip } from "@/components/site/trusted-logo-strip";
import { WhyKasaSection } from "@/components/site/why-kasa-section";
import { getLatestBlogArticles } from "@/lib/blog";

export async function HomePage() {
  const leadsEndpoint = "/api/leads";
  const latestArticles = await getLatestBlogArticles(4);

  return (
    <>
      <HomeHero leadsEndpoint={leadsEndpoint} />
      <TrustedLogoStrip />
      <ProductArchitectureSection />
      <RelatedToolsBlock
        context="home"
        title="Free education tools for students, teachers, and academy teams."
        description="KASA is more than LMS software. Use practical tools to check resumes, plan studies, create classroom material, and handle everyday education workflows."
        limit={8}
      />
      <DeliveryModelsSection />
      <FeatureShowcaseSection />
      <InfrastructureSection />
      <SolutionsSection />
      <LatestArticlesSection articles={latestArticles} />
      <WhyKasaSection />
      <TestimonialsSection />
      <FaqSection />
    </>
  );
}
