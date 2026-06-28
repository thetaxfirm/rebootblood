import { describe, it, expect } from "vitest";
import { buildBreadcrumbJsonLd, buildFaqJsonLd, toAbsoluteUrl } from "../shared/seo";

const SITE = "https://www.rebootblood.clinic";

describe("toAbsoluteUrl", () => {
  it("prefixes a root-relative path with the site origin", () => {
    expect(toAbsoluteUrl("/learn", SITE)).toBe("https://www.rebootblood.clinic/learn");
  });

  it("adds a leading slash when the path is missing one", () => {
    expect(toAbsoluteUrl("learn/x", SITE)).toBe("https://www.rebootblood.clinic/learn/x");
  });

  it("leaves an already-absolute http(s) URL untouched", () => {
    const ext = "https://cdn.example.com/a.png";
    expect(toAbsoluteUrl(ext, SITE)).toBe(ext);
  });

  it("tolerates a trailing slash on the site origin", () => {
    expect(toAbsoluteUrl("/x", SITE + "/")).toBe("https://www.rebootblood.clinic/x");
  });
});

describe("buildBreadcrumbJsonLd", () => {
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Learning Center", path: "/learn" },
    { name: "Is EBOO Safe?", path: "/learn/is-eboo-therapy-safe-fda-risks" },
  ];

  it("emits a valid schema.org BreadcrumbList", () => {
    const ld = buildBreadcrumbJsonLd(crumbs, SITE);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
  });

  it("numbers positions sequentially from 1 and resolves absolute item URLs", () => {
    const ld = buildBreadcrumbJsonLd(crumbs, SITE);
    const items = ld.itemListElement as Array<{ position: number; name: string; item: string }>;
    expect(items.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(items[0].item).toBe("https://www.rebootblood.clinic/");
    expect(items[2].item).toBe("https://www.rebootblood.clinic/learn/is-eboo-therapy-safe-fda-risks");
    expect(items[1].name).toBe("Learning Center");
  });

  it("handles an empty crumb list", () => {
    const ld = buildBreadcrumbJsonLd([], SITE);
    expect(ld.itemListElement).toEqual([]);
  });
});

describe("buildFaqJsonLd", () => {
  it("maps Q&A pairs into a FAQPage with accepted answers", () => {
    const ld = buildFaqJsonLd([{ q: "Is it safe?", a: "It is investigational." }]);
    expect(ld["@type"]).toBe("FAQPage");
    const main = ld.mainEntity as Array<{
      "@type": string;
      name: string;
      acceptedAnswer: { "@type": string; text: string };
    }>;
    expect(main[0].name).toBe("Is it safe?");
    expect(main[0].acceptedAnswer.text).toBe("It is investigational.");
  });
});
