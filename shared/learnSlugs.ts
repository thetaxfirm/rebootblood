/**
 * Slugs of the hand-authored Learning Center articles (defined in
 * client/src/lib/learn.ts). Synced LinkArtemis articles must never reuse these
 * — the route resolver renders hand-authored articles first, so a colliding
 * synced slug would be unreachable. `namespaceSlug` prefixes any collision with
 * `la-`. Keep this list in sync if hand-authored articles are added/removed.
 */
export const RESERVED_LEARN_SLUGS: readonly string[] = [
  "blood-oil-change",
  "ebo2-vs-eboo",
  "ebo3-eboo-blood-therapy",
  "eboo-comparison-guide",
  "eboo-for-autoimmune",
  "eboo-for-cardiovascular",
  "eboo-for-chronic-fatigue",
  "eboo-for-long-covid",
  "eboo-for-longevity",
  "eboo-for-lyme-disease",
  "eboo-for-mold-and-toxins",
  "plasmapheresis-tpe",
  "uvbi-ultraviolet-blood-irradiation",
  "what-is-eboo-therapy",
];

export const RESERVED_LEARN_SLUG_SET: ReadonlySet<string> = new Set(RESERVED_LEARN_SLUGS);
