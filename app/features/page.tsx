import type { Metadata } from "next";
import { FeaturesIndexPage as FeaturesOverviewPage } from "@/components/site/feature-pages/features-index-page";

export const metadata: Metadata = {
  title: "KASA LMS Features for Online Academies and Coaching Institutes",
  description:
    "Explore KASA LMS features for course selling, live classes, payments, certificates, learner dashboards, education CRM, and admin reporting.",
  alternates: {
    canonical: "/features",
  },
};

export default function FeaturesIndexPage() {
  return <FeaturesOverviewPage />;
}
