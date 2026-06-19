import { describe, expect, it } from "vitest";
import { leadMatchesSourceGroup } from "./db";

/**
 * Verifies the source-group split that powers the admin Leads view, where
 * partner inquiries (source === "partner_inquiry") are separated from patient
 * leads (every other source). This exercises the exact predicate used to build
 * the SQL WHERE clause in listLeads().
 */

const SAMPLE = [
  { publicId: "p1", source: "lead_form" },
  { publicId: "p2", source: "guide_capture" },
  { publicId: "p3", source: "contact" },
  { publicId: "x1", source: "partner_inquiry" },
  { publicId: "x2", source: "partner_inquiry" },
];

describe("leadMatchesSourceGroup", () => {
  it("selects only partner_inquiry rows for the partner group", () => {
    const got = SAMPLE.filter((r) => leadMatchesSourceGroup(r.source, "partner")).map((r) => r.publicId);
    expect(got).toEqual(["x1", "x2"]);
  });

  it("excludes partner_inquiry rows for the patient group", () => {
    const got = SAMPLE.filter((r) => leadMatchesSourceGroup(r.source, "patient")).map((r) => r.publicId);
    expect(got).toEqual(["p1", "p2", "p3"]);
  });

  it("returns every row when no group is provided", () => {
    const got = SAMPLE.filter((r) => leadMatchesSourceGroup(r.source)).map((r) => r.publicId);
    expect(got).toHaveLength(SAMPLE.length);
  });

  it("treats a partner-only source as partner and not patient", () => {
    expect(leadMatchesSourceGroup("partner_inquiry", "partner")).toBe(true);
    expect(leadMatchesSourceGroup("partner_inquiry", "patient")).toBe(false);
  });
});
