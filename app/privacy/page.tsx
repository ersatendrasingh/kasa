import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "Privacy Policy | KASA LMS",
  description:
    "Learn how KASA handles academy, learner, lead, payment workflow, media, and communication data across LMS setup and support.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections = [
  {
    title: "Information we handle",
    body: "KASA may process academy details, admin contact information, course data, learner records, faculty information, lead enquiries, support requests, and configuration details required to operate your LMS workspace.",
  },
  {
    title: "How data is used",
    body: "Data is used to provide LMS access, course delivery, live class workflows, email communication, push notifications, payment status visibility, certificates, support, product improvement, and security monitoring.",
  },
  {
    title: "Free resume tool analytics",
    body: "When you use the ATS Resume Checker, KASA records a secure browser identifier, one-way document fingerprint, file type, selected role, check outcome, and score history to improve the tool and diagnose unreadable uploads. Name, email address, and phone number detected in a resume may be securely encrypted for the private KASA admin dashboard. We do not retain the uploaded resume file, full resume text, or job description in this analytics history.",
  },
  {
    title: "Infrastructure and providers",
    body: "KASA may use trusted infrastructure and service providers for hosting, PostgreSQL database operations, media storage, transactional email, live classes, payment gateway workflows, and notifications.",
  },
  {
    title: "Your choices",
    body: "Academy owners can request help with access updates, data corrections, configuration changes, and account questions. For privacy-specific requests, contact the KASA team with your academy details.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy practices for academies, learners, and product enquiries."
        description="KASA is built for education teams that need a connected LMS, so privacy has to cover course data, learner access, payments, live classes, media, email, and admin workflows together."
        points={[
          "Academy and learner data is used to run the LMS experience",
          "Infrastructure partners support hosting, media, email, and payments",
          "Teams can contact KASA for privacy and account requests",
        ]}
        primaryLabel="Book a Demo"
        variant="resource"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Privacy" },
        ]}
      />
      <section className="bg-background px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto grid w-full max-w-[108rem] gap-4 md:grid-cols-2">
          {sections.map((section) => (
            <article
              key={section.title}
              className="rounded-[1.6rem] border border-blue-950/10 bg-white p-6 shadow-xl shadow-blue-950/6 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <h2 className="font-heading text-2xl font-semibold text-slate-950 dark:text-white">
                {section.title}
              </h2>
              <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
                {section.body}
              </p>
            </article>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-7 text-slate-600 dark:text-slate-300">
          For privacy questions or data requests, reach the team from the{" "}
          <Link href="/contact" className="font-semibold text-primary">
            contact page
          </Link>
          .
        </p>
      </section>
    </>
  );
}
