import LandingHero from "@/components/landing-hero";
import { LandingThemeLock } from "@/components/landing-theme-lock";
import ProductFeaturesSection from "@/components/product-features";
import {
  FaqSection,
  PlatformSection,
  PricingSection,
  SiteFooter as LandingFooter,
  TestimonialsSection,
} from "@/components/landing-sections";
import { HowItWorksSection } from "@/components/home-sections/how-it-works-section";

export const metadata = {
  title: "KASA | Online Academy LMS Demo",
  description:
    "Dark campaign landing page for KASA, the LMS software for coaching institutes, online academies, trainers, and EdTech teams.",
  alternates: {
    canonical: "/cwk",
  },
};

export default function CwkLandingPage() {
  return (
    <div className="relative z-10 bg-background text-foreground">
      <LandingThemeLock />
      <LandingHero />
      <PlatformSection />
      <ProductFeaturesSection />
      <TestimonialsSection />
      <HowItWorksSection />
      <PricingSection />
      <FaqSection />
      <LandingFooter />
    </div>
  );
}
