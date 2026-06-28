import { useEffect } from "react";
import { SITE, ASSETS } from "@/lib/site";
import {
  buildBreadcrumbJsonLd as buildBreadcrumbJsonLdShared,
  buildFaqJsonLd as buildFaqJsonLdShared,
  toAbsoluteUrl as toAbsoluteUrlShared,
  type Crumb,
} from "@shared/seo";

/** Canonical origin — single source of truth from SITE.url (trailing slash trimmed). */
const SITE_URL = SITE.url.replace(/\/$/, "");
const DEFAULT_TITLE = "rEBOOtBlood — Advanced EBOO & Plasmapheresis Blood Therapy";
const DEFAULT_DESCRIPTION =
  "EBO3 / EBOO ozone blood therapy and therapeutic plasmapheresis to modulate inflammation, support immunity, and advance whole-body wellness.";
/** Default social share image (absolute URL) used when a page provides none. */
const DEFAULT_OG_IMAGE = `${SITE_URL}${ASSETS.heroAbstract}`;

/** Resolve a possibly-relative path/URL to an absolute URL on the canonical origin. */
export function toAbsoluteUrl(pathOrUrl: string): string {
  return toAbsoluteUrlShared(pathOrUrl, SITE_URL);
}

function setMeta(name: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Open Graph uses the `property` attribute (not `name`). We tag every OG/Twitter
 * meta element we create with `data-seo-og` so they can be cleaned up on unmount
 * without disturbing any static tags in index.html.
 */
function setProperty(property: string, content: string): HTMLMetaElement {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    tag.setAttribute("data-seo-og", "1");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  return tag;
}

function setNamedOg(name: string, content: string): HTMLMetaElement {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[name="${name}"][data-seo-og]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    tag.setAttribute("data-seo-og", "1");
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
  return tag;
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
  return buildFaqJsonLdShared(faqs);
}

/**
 * Build a schema.org BreadcrumbList JSON-LD object from an ordered list of
 * crumbs. Each `path` is resolved to an absolute URL on the canonical origin so
 * Google can render breadcrumb rich results. Pass to `useSeo({ jsonLd })`
 * (alongside other blocks via an array).
 */
export function buildBreadcrumbJsonLd(crumbs: Crumb[]) {
  return buildBreadcrumbJsonLdShared(crumbs, SITE_URL);
}

/**
 * Per-route document head management for a single-page app. Sets the page
 * `<title>`, `<meta name="description">`, `<link rel="canonical">`, and a full
 * set of Open Graph + Twitter Card tags while a page is mounted, then restores
 * the site defaults on unmount so routes never leak metadata into one another.
 * `description` is expected to be 50–160 characters for SEO.
 *
 * Optionally injects one or more page-scoped JSON-LD `<script>` blocks (e.g.
 * Article, FAQPage, BreadcrumbList) that are removed on unmount. Pass a plain
 * object or an array of objects; each is serialized.
 *
 * `canonicalPath` defaults to the current `location.pathname` and is resolved
 * against the canonical site origin. `ogType` defaults to "website"; pass
 * "article" for blog/learning content. `image` is a relative path or absolute
 * URL for the social share image; defaults to the brand hero image.
 */
export function useSeo({
  title,
  description,
  jsonLd,
  canonicalPath,
  ogType = "website",
  image,
}: {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  canonicalPath?: string;
  ogType?: "website" | "article";
  image?: string;
}) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);

    const path = canonicalPath ?? window.location.pathname;
    const url = `${SITE_URL}${path}`;
    setCanonical(url);

    const ogImage = image ? toAbsoluteUrl(image) : DEFAULT_OG_IMAGE;

    // Open Graph (property=) + Twitter Card (name=). All tagged data-seo-og so
    // they are removed together on unmount.
    const ogTags: HTMLMetaElement[] = [
      setProperty("og:type", ogType),
      setProperty("og:site_name", SITE.name),
      setProperty("og:title", title),
      setProperty("og:description", description),
      setProperty("og:url", url),
      setProperty("og:image", ogImage),
      setNamedOg("twitter:card", "summary_large_image"),
      setNamedOg("twitter:title", title),
      setNamedOg("twitter:description", description),
      setNamedOg("twitter:image", ogImage),
    ];

    // Accept a single JSON-LD object or an array; emit one <script> per object
    // so a page can carry e.g. Article + BreadcrumbList + FAQPage schema.
    const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
    const scripts: HTMLScriptElement[] = blocks.map((block) => {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.setAttribute("data-seo-jsonld", "page");
      s.text = JSON.stringify(block);
      document.head.appendChild(s);
      return s;
    });

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
      setCanonical(SITE_URL + "/");
      ogTags.forEach((t) => t.remove());
      scripts.forEach((s) => s.remove());
    };
    // jsonLd is serialized for comparison so callers can pass inline objects.
  }, [title, description, canonicalPath, ogType, image, jsonLd ? JSON.stringify(jsonLd) : ""]);
}
