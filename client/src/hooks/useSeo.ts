import { useEffect } from "react";

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

/**
 * Per-route document head management for a single-page app. Sets the page
 * `<title>` and `<meta name="description">` while a page is mounted, then
 * restores the site defaults on unmount so routes never leak metadata into
 * one another. `description` is expected to be 50–160 characters for SEO.
 *
 * Optionally injects a page-scoped JSON-LD `<script>` (e.g. Article schema)
 * that is removed on unmount. Pass a plain object; it is serialized for you.
 */
export function useSeo({
  title,
  description,
  jsonLd,
}: {
  title: string;
  description: string;
  jsonLd?: Record<string, unknown>;
}) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);

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
      if (script) script.remove();
    };
    // jsonLd is serialized for comparison so callers can pass inline objects.
  }, [title, description, jsonLd ? JSON.stringify(jsonLd) : ""]);
}
