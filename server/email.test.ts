import { describe, it, expect } from "vitest";
import { verifySmtpCredentials, formatLeadEmail, formatQuestionnaireEmail } from "./_core/email";

describe("Email formatters", () => {
  it("formatLeadEmail produces subject and text with lead info", () => {
    const result = formatLeadEmail({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "702-555-1234",
      interest: "ebo3",
      source: "lead_form",
      selectedTier: "Core 3L",
      message: "I'd like to learn more about EBO3.",
    });
    expect(result.subject).toContain("Jane Doe");
    expect(result.subject).toContain("ebo3");
    expect(result.text).toContain("jane@example.com");
    expect(result.text).toContain("702-555-1234");
    expect(result.text).toContain("Core 3L");
    expect(result.text).toContain("I'd like to learn more about EBO3.");
  });

  it("formatLeadEmail handles minimal fields", () => {
    const result = formatLeadEmail({ name: "Bob", email: "bob@test.com" });
    expect(result.subject).toContain("Bob");
    expect(result.text).toContain("bob@test.com");
    expect(result.text).not.toContain("undefined");
  });

  it("formatQuestionnaireEmail produces subject and text with submission info", () => {
    const result = formatQuestionnaireEmail({
      name: "Alice Smith",
      email: "alice@example.com",
      phone: "702-555-0000",
      preferredContact: "phone",
      interest: "plasmapheresis",
      volume: "4.5L",
      selectedTier: "Complete",
      location: "Las Vegas, NV",
      goals: "Reduce inflammation, Improve energy",
    });
    expect(result.subject).toContain("Alice Smith");
    expect(result.subject).toContain("plasmapheresis");
    expect(result.text).toContain("alice@example.com");
    expect(result.text).toContain("4.5L");
    expect(result.text).toContain("Complete");
    expect(result.text).toContain("Las Vegas, NV");
    expect(result.text).toContain("Reduce inflammation, Improve energy");
    // HIPAA: must NOT contain health screening data
    expect(result.text).toContain("NOT included in this email");
  });

  it("formatQuestionnaireEmail handles minimal fields", () => {
    const result = formatQuestionnaireEmail({ name: "X", email: "x@y.com" });
    expect(result.subject).toContain("X");
    expect(result.text).not.toContain("undefined");
  });
});

describe("SMTP live credential verification", () => {
  it("authenticates against Google SMTP (verifies App Password is valid)", async () => {
    const valid = await verifySmtpCredentials();
    expect(valid).toBe(true);
  }, 15000);
});
