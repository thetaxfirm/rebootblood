import { describe, expect, it } from "vitest";
import {
  hasAuthParams,
  stripAuthParamsFromUrl,
} from "../shared/stripAuthParams";

describe("hasAuthParams", () => {
  it("detects an OAuth code param", () => {
    expect(hasAuthParams("?code=2SaXmUeEdFdqk5n7eMrn9f")).toBe(true);
  });

  it("detects state / error params", () => {
    expect(hasAuthParams("?state=abc")).toBe(true);
    expect(hasAuthParams("?error=access_denied")).toBe(true);
  });

  it("returns false for empty or non-auth query strings", () => {
    expect(hasAuthParams("")).toBe(false);
    expect(hasAuthParams("?interest=eboo&volume=4.5L")).toBe(false);
  });

  it("works whether or not a leading ? is present", () => {
    expect(hasAuthParams("code=x")).toBe(true);
  });
});

describe("stripAuthParamsFromUrl", () => {
  it("removes the code param from an absolute root URL", () => {
    expect(
      stripAuthParamsFromUrl(
        "https://www.rebootblood.clinic/?code=2SaXmUeEdFdqk5n7eMrn9f",
      ),
    ).toBe("https://www.rebootblood.clinic/");
  });

  it("removes the full set of auth params but keeps other query params", () => {
    expect(
      stripAuthParamsFromUrl(
        "https://www.rebootblood.clinic/eligibility?code=x&state=y&interest=eboo&volume=4.5L",
      ),
    ).toBe("https://www.rebootblood.clinic/eligibility?interest=eboo&volume=4.5L");
  });

  it("preserves the path and hash fragment", () => {
    expect(
      stripAuthParamsFromUrl("https://host.example/eboo?code=x#pricing"),
    ).toBe("https://host.example/eboo#pricing");
  });

  it("handles relative URLs and keeps them relative", () => {
    expect(stripAuthParamsFromUrl("/?code=abc")).toBe("/");
    expect(stripAuthParamsFromUrl("/admin?code=abc&tab=leads")).toBe(
      "/admin?tab=leads",
    );
  });

  it("is a no-op when there are no auth params", () => {
    expect(
      stripAuthParamsFromUrl("https://host.example/learn?ref=newsletter"),
    ).toBe("https://host.example/learn?ref=newsletter");
  });

  it("strips OAuth error params returned on failure", () => {
    expect(
      stripAuthParamsFromUrl(
        "/?error=access_denied&error_description=User+denied",
      ),
    ).toBe("/");
  });
});
