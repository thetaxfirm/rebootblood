/**
 * Framework-agnostic SEO structured-data helpers. Kept free of DOM/React so
 * they can be unit-tested under the Node vitest runner and reused by the client
 * `useSeo` hook. The canonical origin is passed in by the caller (the hook
 * supplies it from SITE.url) to avoid coupling this module to client config.
 */

/** Resolve a possibly-relative path/URL to an absolute URL on `siteUrl`. */
export function toAbsoluteUrl(pathOrUrl: string, siteUrl: string): string {
  const base = siteUrl.replace(/\/$/, "");
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  return `${base}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

export type Crumb = { name: string; path: string };

/**
 * Build a schema.org BreadcrumbList JSON-LD object from an ordered list of
 * crumbs. Each `path` is resolved to an absolute URL on `siteUrl` so Google can
 * render breadcrumb rich results.
 */
export function buildBreadcrumbJsonLd(crumbs: Crumb[], siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: toAbsoluteUrl(c.path, siteUrl),
    })),
  };
}

/** Build a schema.org FAQPage JSON-LD object from Q&A pairs. */
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
