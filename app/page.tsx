import type { Metadata } from "next";
import { HomePage } from "@/components/site/home-page";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "LMS Software, Free Education Tools & Practical Guides",
  description:
    "KASA combines LMS software for coaching institutes and online academies with free tools and practical guides for students, teachers, and education teams.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "KASA | LMS Software, Free Education Tools & Guides",
    description:
      "Run your academy with KASA LMS, use free education tools, and read practical guides for students, teachers, and education teams.",
    url: "https://www.getkasa.in",
  },
};

export default async function Home() {
  return <HomePage />;
}
