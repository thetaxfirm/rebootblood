import { describe, expect, it } from "vitest";
import { fetchArticleList } from "../server/_core/linkartemis";

/**
 * Live connectivity test: validates that the configured LINKARTEMIS_API_KEY
 * authenticates against the real app.linkartemis.com API. Skipped automatically
 * when the key is not present in the environment (e.g. some CI contexts), so
 * the suite never fails purely due to a missing secret.
 */
const hasKey = Boolean(process.env.LINKARTEMIS_API_KEY);

describe.runIf(hasKey)("LinkArtemis live connectivity", () => {
  it("authenticates and returns an article list array", async () => {
    const list = await fetchArticleList();
    expect(Array.isArray(list)).toBe(true);
    // Each item (if any) should expose the documented summary fields.
    for (const item of list) {
      expect(typeof item.id).toBe("string");
      expect(typeof item.title).toBe("string");
      expect(typeof item.slug).toBe("string");
    }
  }, 20000);
});
