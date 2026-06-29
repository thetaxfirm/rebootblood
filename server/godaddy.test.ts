import { describe, it, expect } from "vitest";
import {
  buildGoDaddyAuthHeader,
  hasGoDaddyCredentials,
  validateDnsRecord,
} from "./_core/godaddy";
import { ENV } from "./_core/env";

describe("GoDaddy pure helpers", () => {
  it("builds the sso-key Authorization header", () => {
    expect(buildGoDaddyAuthHeader("KEY", "SECRET")).toBe("sso-key KEY:SECRET");
  });

  it("detects presence of credentials", () => {
    expect(hasGoDaddyCredentials("k", "s")).toBe(true);
    expect(hasGoDaddyCredentials("", "s")).toBe(false);
    expect(hasGoDaddyCredentials("k", "")).toBe(false);
  });

  it("validates DNS records", () => {
    expect(validateDnsRecord({ type: "A", name: "@", data: "1.2.3.4" })).toBeNull();
    expect(validateDnsRecord({ type: "CNAME", name: "www", data: "@", ttl: 3600 })).toBeNull();
    expect(validateDnsRecord({ type: "A", name: "", data: "1.2.3.4" })).toMatch(/name is required/i);
    expect(validateDnsRecord({ type: "A", name: "@", data: "" })).toMatch(/data\/value is required/i);
    expect(validateDnsRecord({ type: "A", name: "@", data: "1.2.3.4", ttl: 10 })).toMatch(/TTL/i);
    expect(validateDnsRecord({ type: "MX", name: "@", data: "mail.x.com" })).toMatch(/priority/i);
    // @ts-expect-error invalid type on purpose
    expect(validateDnsRecord({ type: "BOGUS", name: "@", data: "x" })).toMatch(/Unsupported/i);
  });
});

describe("GoDaddy live credentials", () => {
  const configured = hasGoDaddyCredentials();
  const maybe = configured ? it : it.skip;

  maybe(
    "authenticates against the production API (lists domains)",
    async () => {
      const res = await fetch(`${ENV.godaddyApiUrl}/v1/domains?limit=1`, {
        headers: {
          Authorization: buildGoDaddyAuthHeader(ENV.godaddyApiKey, ENV.godaddyApiSecret),
          Accept: "application/json",
        },
      });
      expect(res.status).toBe(200);
      const body = await res.json();
      expect(Array.isArray(body)).toBe(true);
    },
    20000,
  );
});
