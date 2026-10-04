const SITE_URL = "https://www.getkasa.in";

type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export function SiteStructuredData() {
  return (
    <JsonLd
      data={[
        {
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "KASA",
          url: SITE_URL,
          logo: `${SITE_URL}/kasa-logo-light.png`,
          email: "hello@getkasa.in",
          sameAs: [
            "https://www.instagram.com/getkasalms",
            "https://www.youtube.com/@codewithkasa751",
            "https://www.linkedin.com/company/getkasa",
            "https://www.facebook.com/profile.php?id=61590188274201",
            "https://x.com/getkasalms",
          ],
          areaServed: {
            "@type": "Country",
            name: "India",
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          name: "KASA",
          url: SITE_URL,
          publisher: {
            "@id": `${SITE_URL}/#organization`,
          },
          inLanguage: "en-IN",
        },
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "@id": `${SITE_URL}/#software`,
          name: "KASA LMS",
          applicationCategory: "EducationalApplication",
          operatingSystem: "Web",
          url: SITE_URL,
          description:
            "KASA is LMS software for coaching institutes, online academies, trainers, and EdTech teams to sell courses, run live classes, manage learners, collect payments, and issue certificates.",
          publisher: {
            "@id": `${SITE_URL}/#organization`,
          },
          offers: {
            "@type": "Offer",
            priceCurrency: "INR",
            availability: "https://schema.org/InStock",
            url: `${SITE_URL}/pricing`,
          },
        },
      ]}
    />
  );
}

export function BreadcrumbStructuredData({
  items,
}: {
  items: Array<{ name: string; href: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: item.name,
          item: `${SITE_URL}${item.href}`,
        })),
      }}
    />
  );
}

export function ItemListStructuredData({
  name,
  items,
}: {
  name: string;
  items: Array<{ title: string; href: string; description: string }>;
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "ItemList",
        name,
        itemListElement: items.map((item, index) => ({
          "@type": "ListItem",
          position: index + 1,
          url: `${SITE_URL}${item.href}`,
          name: item.title,
          description: item.description,
        })),
      }}
    />
  );
}

export function WebPageStructuredData({
  name,
  description,
  href,
  image,
  pageType = "WebPage",
}: {
  name: string;
  description: string;
  href: string;
  image?: string;
  pageType?: "WebPage" | "Article";
}) {
  const url = `${SITE_URL}${href}`;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": pageType,
        "@id": `${url}#webpage`,
        url,
        name,
        headline: name,
        description,
        inLanguage: "en-IN",
        isPartOf: {
          "@id": `${SITE_URL}/#website`,
        },
        publisher: {
          "@id": `${SITE_URL}/#organization`,
        },
        image: image ? `${SITE_URL}${image}` : undefined,
      }}
    />
  );
}

export function FaqStructuredData({
  faqs,
}: {
  faqs: Array<[string, string]>;
}) {
  if (!faqs.length) return null;

  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer,
          },
        })),
      }}
    />
  );
}
