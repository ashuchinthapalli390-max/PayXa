import { site } from "@/lib/site";

export function GlobalJsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    alternateName: ["PayXa India", "PayXa UPI", "PayXa Payment Automation"],
    url: `${site.url}/`,
    logo: {
      "@type": "ImageObject",
      "@id": `${site.url}/#logo`,
      url: `${site.url}/brand/payxa-lockup.png`,
      caption: "PayXa Official Logo",
      width: 720,
      height: 720,
    },
    image: `${site.url}/brand/payxa-lockup.png`,
    description: site.description,
    parentOrganization: {
      "@type": "Organization",
      name: site.publisher,
      url: site.publisherUrl,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: site.supportEmail,
      availableLanguage: ["English", "Hindi"],
      areaServed: "IN",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "IN",
    },
    knowsAbout: [
      "UPI Payments",
      "Unified Payments Interface",
      "Payment Automation",
      "Merchant Reconciliation",
      "Hosted Checkout",
      "Dynamic UPI QR Code Generation",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.name,
    alternateName: "PayXa Official Website",
    description: site.description,
    publisher: {
      "@id": `${site.url}/#organization`,
    },
    inLanguage: "en-IN",
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${site.url}/#software`,
    name: "PayXa UPI Checkout & Reconciliation Software",
    applicationCategory: "FinancialApplication",
    applicationSubCategory: "Payment Automation Software",
    operatingSystem: "Web, Android",
    author: {
      "@id": `${site.url}/#organization`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
      description: "Proposed V1 Free Starter Plan with ₹0 PayXa platform fee",
    },
    featureList: [
      "Direct UPI payments into merchant receiving account",
      "Hosted checkout sessions with dynamic UPI QR & app intents",
      "Instant Payment Started push alerts to paired Android merchant phones",
      "Reconciliation across incoming credit evidence",
      "Developer API and signed webhook dispatches",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
    </>
  );
}

export function FaqJsonLd({ items }: { items: [string, string][] }) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${site.url}${item.url}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
    />
  );
}
