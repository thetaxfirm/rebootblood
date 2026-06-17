import { describe, expect, it } from "vitest";
import { encryptJson, decryptJson, encryptString, decryptString, hashForAudit } from "./_core/phi";

describe("PHI encryption (AES-256-GCM)", () => {
  it("round-trips a string", () => {
    const secret = "Patient: Jane Doe, DOB 1980-01-01";
    const token = encryptString(secret);
    expect(token).not.toContain("Jane");
    expect(token.split(".")).toHaveLength(3);
    expect(decryptString(token)).toBe(secret);
  });

  it("round-trips a JSON object", () => {
    const obj = { firstName: "Jane", email: "jane@example.com", conditions: ["fatigue"] };
    const token = encryptJson(obj);
    expect(token).not.toContain("jane@example.com");
    expect(decryptJson(token)).toEqual(obj);
  });

  it("produces different ciphertext for the same plaintext (random IV)", () => {
    const a = encryptString("same");
    const b = encryptString("same");
    expect(a).not.toBe(b);
    expect(decryptString(a)).toBe("same");
    expect(decryptString(b)).toBe("same");
  });

  it("fails to decrypt tampered ciphertext (auth tag protects integrity)", () => {
    const token = encryptString("integrity matters");
    const [iv, tag, data] = token.split(".");
    const tamperedData = Buffer.from(data, "base64");
    tamperedData[0] = tamperedData[0] ^ 0xff;
    const tampered = [iv, tag, tamperedData.toString("base64")].join(".");
    expect(() => decryptString(tampered)).toThrow();
  });

  it("hashForAudit is deterministic, non-reversible, and null-safe", () => {
    expect(hashForAudit(null)).toBeNull();
    expect(hashForAudit("")).toBeNull();
    const h1 = hashForAudit("203.0.113.5");
    const h2 = hashForAudit("203.0.113.5");
    expect(h1).toBe(h2);
    expect(h1).not.toContain("203.0.113.5");
  });
});
