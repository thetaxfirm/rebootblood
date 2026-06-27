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
 */
export function useSeo({ title, description }: { title: string; description: string }) {
  useEffect(() => {
    document.title = title;
    setMeta("description", description);
    return () => {
      document.title = DEFAULT_TITLE;
      setMeta("description", DEFAULT_DESCRIPTION);
    };
  }, [title, description]);
}
