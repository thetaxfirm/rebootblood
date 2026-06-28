import { describe, expect, it } from "vitest";
import {
  sanitizeArticleHtml,
  namespaceSlug,
  mapRemoteArticle,
  parseRemoteDate,
  syncLinkArtemis,
  type LinkArtemisArticleDetail,
  type LinkArtemisListItem,
} from "../server/_core/linkartemis";
import { RESERVED_LEARN_SLUG_SET } from "../shared/learnSlugs";

describe("sanitizeArticleHtml", () => {
  it("strips <script> and event handlers", () => {
    const dirty = `<p onclick="steal()">Hi</p><script>alert(1)</script>`;
    const clean = sanitizeArticleHtml(dirty);
    expect(clean).not.toContain("<script");
    expect(clean).not.toContain("onclick");
    expect(clean).toContain("Hi");
  });

  it("drops javascript: links but keeps safe https links", () => {
    const dirty = `<a href="javascript:alert(1)">x</a><a href="https://ok.com">y</a>`;
    const clean = sanitizeArticleHtml(dirty);
    expect(clean).not.toContain("javascript:");
    expect(clean).toContain("https://ok.com");
  });

  it("forces external links to open safely (rel/target)", () => {
    const clean = sanitizeArticleHtml(`<a href="https://x.com">link</a>`);
    expect(clean).toContain('target="_blank"');
    expect(clean).toContain("noopener");
    expect(clean).toContain("nofollow");
  });

  it("keeps in-page anchor links without forcing target", () => {
    const clean = sanitizeArticleHtml(`<a href="#section">jump</a>`);
    expect(clean).toContain('href="#section"');
    expect(clean).not.toContain('target="_blank"');
  });

  it("preserves headings, lists, images and adds lazy loading", () => {
    const clean = sanitizeArticleHtml(
      `<h2>T</h2><ul><li>a</li></ul><img src="https://img/x.jpg" alt="a">`,
    );
    expect(clean).toContain("<h2>");
    expect(clean).toContain("<li>");
    expect(clean).toContain('loading="lazy"');
  });
});

describe("namespaceSlug", () => {
  it("normalizes arbitrary text to a slug", () => {
    expect(namespaceSlug("Hello World!", new Set())).toBe("hello-world");
  });

  it("prefixes la- when the slug collides with a reserved Learn slug", () => {
    expect(namespaceSlug("what-is-eboo-therapy", RESERVED_LEARN_SLUG_SET)).toBe(
      "la-what-is-eboo-therapy",
    );
  });

  it("leaves non-colliding slugs untouched", () => {
    expect(
      namespaceSlug("eboo-treatment-cost-safety-guide", RESERVED_LEARN_SLUG_SET),
    ).toBe("eboo-treatment-cost-safety-guide");
  });

  it("returns empty string for empty input", () => {
    expect(namespaceSlug("", RESERVED_LEARN_SLUG_SET)).toBe("");
  });
});

describe("parseRemoteDate", () => {
  it("parses ISO timestamps", () => {
    const d = parseRemoteDate("2026-06-27T20:32:28.087689+00:00");
    expect(d).toBeInstanceOf(Date);
    expect(d!.getUTCFullYear()).toBe(2026);
  });
  it("returns null for missing/invalid", () => {
    expect(parseRemoteDate(null)).toBeNull();
    expect(parseRemoteDate("not-a-date")).toBeNull();
  });
});

const fullDetail: LinkArtemisArticleDetail = {
  id: "uuid-1",
  title: "EBOO Treatment Cost Guide",
  slug: "eboo-treatment-cost-safety-guide",
  excerpt: "An excerpt",
  meta_description: "A meta description",
  hero_image_url: "https://img/h.jpg",
  keywords: ["EBOO treatment"],
  language_code: "us",
  created_at: "2026-06-27T20:32:28Z",
  content_html: "<h2>Heading</h2><p>Body text</p>",
};

describe("mapRemoteArticle", () => {
  it("maps a complete remote article into an insert row", () => {
    const row = mapRemoteArticle(fullDetail);
    expect(row).not.toBeNull();
    expect(row!.remoteId).toBe("uuid-1");
    expect(row!.slug).toBe("eboo-treatment-cost-safety-guide");
    expect(row!.source).toBe("linkartemis");
    expect(row!.contentHtml).toContain("<h2>");
    expect(JSON.parse(row!.keywords as string)).toEqual(["EBOO treatment"]);
  });

  it("namespaces a colliding slug via la- prefix", () => {
    const row = mapRemoteArticle({ ...fullDetail, slug: "what-is-eboo-therapy" });
    expect(row!.slug).toBe("la-what-is-eboo-therapy");
  });

  it("falls back meta_description to excerpt when absent", () => {
    const row = mapRemoteArticle({ ...fullDetail, meta_description: null });
    expect(row!.metaDescription).toBe("An excerpt");
  });

  it("returns null when content is empty", () => {
    expect(mapRemoteArticle({ ...fullDetail, content_html: "" })).toBeNull();
  });

  it("returns null when id is missing", () => {
    expect(mapRemoteArticle({ ...fullDetail, id: "" })).toBeNull();
  });
});

describe("syncLinkArtemis", () => {
  const list: LinkArtemisListItem[] = [
    { id: "a", title: "A", slug: "alpha-article" },
    { id: "b", title: "B", slug: "beta-article" },
    { id: "c", title: "C", slug: "gamma-article" },
  ];
  const details: Record<string, LinkArtemisArticleDetail> = {
    a: { id: "a", title: "A", slug: "alpha-article", content_html: "<p>a</p>" },
    b: { id: "b", title: "B", slug: "beta-article", content_html: "<p>b</p>" },
    c: { id: "c", title: "C", slug: "gamma-article", content_html: "" }, // empty -> skipped
  };

  it("fetches details, maps, upserts, and summarizes (inserted/updated/skipped)", async () => {
    const upserts: string[] = [];
    const summary = await syncLinkArtemis(
      async (row) => {
        upserts.push(row.remoteId);
        return row.remoteId === "a" ? "inserted" : "updated";
      },
      {},
      {
        list: async () => list,
        detail: async (id) => details[id],
      },
    );
    expect(summary.fetched).toBe(3);
    expect(summary.inserted).toBe(1);
    expect(summary.updated).toBe(1);
    expect(summary.skipped).toBe(1); // empty-content article c
    expect(summary.errors).toEqual([]);
    expect(upserts).toEqual(["a", "b"]);
  });

  it("records a per-article error without aborting the whole sync", async () => {
    const summary = await syncLinkArtemis(
      async () => "inserted",
      {},
      {
        list: async () => list,
        detail: async (id) => {
          if (id === "b") throw new Error("HTTP 500");
          return details[id];
        },
      },
    );
    expect(summary.fetched).toBe(3);
    expect(summary.errors.length).toBe(1);
    expect(summary.errors[0]).toContain("b:");
    // a inserted, c skipped (empty), b errored
    expect(summary.inserted).toBe(1);
    expect(summary.skipped).toBe(1);
  });
});
