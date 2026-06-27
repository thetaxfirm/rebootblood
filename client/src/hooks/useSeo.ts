import { useEffect } from "react";
import { SITE } from "@/lib/site";

/** Canonical origin — single source of truth from SITE.url (trailing slash trimmed). */
const SITE_URL = SITE.url.replace(/\/$/, "");
const DEFAULT_TITLE = "rEBOOtBlood — Advanced EBOO & Plasmapheresis Blood Therapy";
const DEFAULT_DESCRIPTION =
  "EBO3 / EBOO ozone blood therapy and therapeutic plasmapheresis to modulate inflammation, support immunity, and advance whole-body wellness.";

function setMeta(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function setCanonical(href: string) {
  let tag = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.setAttribute("rel", "canonical");
    document.head.appendChild(tag);
  }
  tag.setAttribute("href", href);
}

/**
 * Build a schema.org FAQPage JSON-LD object from a list of Q&A pairs.
 * Pass directly to `useSeo({ jsonLd })` to emit FAQ rich-result markup.
 */
export function buildFaqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Per-route document head management for a single-page app. Sets the page
 * `<title>`, `<meta name="description">`, and `<link rel="canonical">` while a
 * page is mounted, then restores the site defaults on unmount so routes never
 * leak metadata into one another. `description` is expected to be 50–160
 * characters for SEO.
 *
 * Optionally injects a page-scoped JSON-LD `<script>` (e.g. Article or FAQPage
 * schema) that is removed on unmount. Pass a plain object; it is serialized.
 *
 * `canonicalPath` defaults to the current `location.pathname` and is resolved
 * against the canonical site origin.
 */
export function useSeo({
  title,
  description,
  jsonLd,
  canonicalPath,
}: {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
  canonicalPath?: string;
}) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);

    const path = canonicalPath ?? window.location.pathname;
    setCanonical(`${SITE_URL}${path}`);

    let script: HTMLScriptElement | null = null;
    if (jsonLd) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo-jsonld", "page");
      script.text = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
      setCanonical(SITE_URL + "/");
      if (script) script.remove();
    };
    // jsonLd is serialized for comparison so callers can pass inline objects.
  }, [title, description, canonicalPath, jsonLd ? JSON.stringify(jsonLd) : ""]);
}
