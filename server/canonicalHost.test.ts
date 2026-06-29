import { describe, it, expect } from "vitest";
import { canonicalRedirectTarget } from "./_core/canonicalHost";

describe("canonicalRedirectTarget", () => {
  it("redirects bare apex to www, preserving path", () => {
    expect(canonicalRedirectTarget("rebootblood.clinic", "/learn")).toBe(
      "https://www.rebootblood.clinic/learn"
    );
  });

  it("preserves query string and deep paths", () => {
    expect(
      canonicalRedirectTarget("rebootblood.clinic", "/learn/eboo-uv-light-therapy-explained?ref=x")
    ).toBe("https://www.rebootblood.clinic/learn/eboo-uv-light-therapy-explained?ref=x");
  });

  it("handles apex with an explicit port", () => {
    expect(canonicalRedirectTarget("rebootblood.clinic:443", "/")).toBe(
      "https://www.rebootblood.clinic/"
    );
  });

  it("is case-insensitive on the host", () => {
    expect(canonicalRedirectTarget("ReBootBlood.Clinic", "/")).toBe(
      "https://www.rebootblood.clinic/"
    );
  });

  it("does NOT redirect the canonical www host", () => {
    expect(canonicalRedirectTarget("www.rebootblood.clinic", "/learn")).toBeNull();
  });

  it("does NOT redirect manus.space preview/deploy hosts", () => {
    expect(canonicalRedirectTarget("rebootblood.manus.space", "/")).toBeNull();
    expect(
      canonicalRedirectTarget("rebootblood-qxafvfif.manus.space", "/")
    ).toBeNull();
  });

  it("does NOT redirect localhost (dev)", () => {
    expect(canonicalRedirectTarget("localhost:3000", "/")).toBeNull();
  });

  it("returns null when host header is missing", () => {
    expect(canonicalRedirectTarget(undefined, "/")).toBeNull();
  });

  it("defaults empty path to root", () => {
    expect(canonicalRedirectTarget("rebootblood.clinic", "")).toBe(
      "https://www.rebootblood.clinic/"
    );
  });
});
