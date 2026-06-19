import { describe, it, expect } from "vitest";
import { aggregateTierEventRows, tierEventRangeStartMs } from "./db";

describe("aggregateTierEventRows", () => {
  it("splits clicks by action and rolls up totals per tier+interest", () => {
    const stats = aggregateTierEventRows([
      { tier: "EBO3 4.5L session", treatmentInterest: "eboo", action: "book", count: 5 },
      { tier: "EBO3 4.5L session", treatmentInterest: "eboo", action: "check_eligibility", count: 3 },
      { tier: "Plasmapheresis — Core", treatmentInterest: "plasmapheresis", action: "book", count: 2 },
    ]);

    const ebo3 = stats.find((s) => s.tier === "EBO3 4.5L session");
    expect(ebo3).toBeDefined();
    expect(ebo3!.bookClicks).toBe(5);
    expect(ebo3!.checkEligibilityClicks).toBe(3);
    expect(ebo3!.total).toBe(8);

    const core = stats.find((s) => s.tier === "Plasmapheresis — Core");
    expect(core!.bookClicks).toBe(2);
    expect(core!.checkEligibilityClicks).toBe(0);
    expect(core!.total).toBe(2);
  });

  it("keeps the same tier under different therapies as separate rows", () => {
    const stats = aggregateTierEventRows([
      { tier: "Combo", treatmentInterest: "eboo", action: "book", count: 1 },
      { tier: "Combo", treatmentInterest: "plasmapheresis", action: "book", count: 4 },
    ]);
    expect(stats).toHaveLength(2);
  });

  it("sorts by total descending", () => {
    const stats = aggregateTierEventRows([
      { tier: "Low", treatmentInterest: "eboo", action: "book", count: 1 },
      { tier: "High", treatmentInterest: "eboo", action: "book", count: 9 },
      { tier: "Mid", treatmentInterest: "eboo", action: "book", count: 5 },
    ]);
    expect(stats.map((s) => s.tier)).toEqual(["High", "Mid", "Low"]);
  });

  it("ignores unknown action kinds in the per-action split but counts them in total", () => {
    const stats = aggregateTierEventRows([
      { tier: "X", treatmentInterest: "eboo", action: "book", count: 2 },
      { tier: "X", treatmentInterest: "eboo", action: "view", count: 3 },
    ]);
    expect(stats[0].bookClicks).toBe(2);
    expect(stats[0].checkEligibilityClicks).toBe(0);
    expect(stats[0].total).toBe(5);
  });

  it("returns an empty array when there are no rows", () => {
    expect(aggregateTierEventRows([])).toEqual([]);
  });
});

describe("tierEventRangeStartMs", () => {
  const now = Date.UTC(2026, 5, 18, 0, 0, 0); // fixed reference
  const DAY = 24 * 60 * 60 * 1000;

  it("returns null for 'all' (no lower bound)", () => {
    expect(tierEventRangeStartMs("all", now)).toBeNull();
  });

  it("resolves 7d / 30d / 90d to the correct cutoff", () => {
    expect(tierEventRangeStartMs("7d", now)).toBe(now - 7 * DAY);
    expect(tierEventRangeStartMs("30d", now)).toBe(now - 30 * DAY);
    expect(tierEventRangeStartMs("90d", now)).toBe(now - 90 * DAY);
  });

  it("a wider window always starts at or before a narrower one", () => {
    const d7 = tierEventRangeStartMs("7d", now)!;
    const d30 = tierEventRangeStartMs("30d", now)!;
    const d90 = tierEventRangeStartMs("90d", now)!;
    expect(d30).toBeLessThan(d7);
    expect(d90).toBeLessThan(d30);
  });
});
