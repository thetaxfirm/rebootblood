import { describe, it, expect } from "vitest";
import {
  formatLeadNotification,
  formatQuestionnaireNotification,
} from "@shared/notificationBody";
import type { LeadPayload, QuestionnairePayload } from "@shared/forms";

const baseLead: LeadPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "555-123-4567",
  treatmentInterest: "eboo",
  message: "Interested in a 4.5L session.",
  source: "request_appointment",
  selectedTier: "EBO3 4.5L session",
  consentContact: true,
  submittedAt: 1_700_000_000_000,
};

const baseQuestionnaire: QuestionnairePayload = {
  age: 47,
  biologicalSex: "female",
  knownG6PDDeficiency: "no",
  pregnantOrNursing: "na",
  bleedingOrClottingDisorder: "no",
  recentCardiacOrStrokeEvent: "no",
  currentMedications: "Metformin 500mg",
  conditions: ["Long COVID", "Autoimmune"],
  conditionsOther: "",
  symptoms: ["Fatigue", "Brain fog"],
  symptomDuration: "6to12m",
  goals: ["Reduce inflammation", "Boost energy & vitality"],
  treatmentInterest: "both",
  ebo3Volume: "4.5L",
  additionalNotes: "Prefers mornings.",
  firstName: "John",
  lastName: "Smith",
  email: "john@example.com",
  phone: "555-987-6543",
  preferredContact: "phone",
  city: "Henderson",
  state: "NV",
  consentTreatmentInfo: true,
  consentPrivacy: true,
  consentContact: true,
  submittedAt: 1_700_000_000_000,
};

describe("formatLeadNotification", () => {
  it("includes contact + intent details in the body", () => {
    const body = formatLeadNotification({
      publicId: "L-abc123",
      payload: baseLead,
      source: "request_appointment",
      selectedTier: "EBO3 4.5L session",
    });
    expect(body).toContain("L-abc123");
    expect(body).toContain("Jane Doe");
    expect(body).toContain("jane@example.com");
    expect(body).toContain("555-123-4567");
    expect(body).toContain("EBO3 / EBOO");
    expect(body).toContain("EBO3 4.5L session");
    expect(body).toContain("Interested in a 4.5L session.");
  });

  it("omits optional empty fields cleanly (no 'Phone:' line when blank)", () => {
    const body = formatLeadNotification({
      publicId: "L-xyz",
      payload: { ...baseLead, phone: "", message: "", selectedTier: "" },
      source: "lead_form",
      selectedTier: null,
    });
    expect(body).not.toMatch(/^Phone:/m);
    expect(body).not.toMatch(/^Message:/m);
    expect(body).not.toMatch(/^Selected tier:/m);
    expect(body).toContain("Jane Doe");
  });
});

describe("formatQuestionnaireNotification", () => {
  it("includes contact + intent + goals", () => {
    const body = formatQuestionnaireNotification({
      publicId: "Q-abc123",
      payload: baseQuestionnaire,
    });
    expect(body).toContain("Q-abc123");
    expect(body).toContain("John Smith");
    expect(body).toContain("john@example.com");
    expect(body).toContain("555-987-6543");
    expect(body).toContain("Henderson, NV");
    expect(body).toContain("Both treatments");
    expect(body).toContain("4.5L");
    expect(body).toContain("Reduce inflammation");
  });

  it("EXCLUDES sensitive health-screening answers (privacy policy)", () => {
    const body = formatQuestionnaireNotification({
      publicId: "Q-abc123",
      payload: baseQuestionnaire,
    });
    // Clinical screening values must never appear in the notification body.
    expect(body).not.toContain("Metformin");
    expect(body).not.toContain("G6PD");
    expect(body).not.toContain("Long COVID");
    expect(body).not.toContain("Autoimmune");
    expect(body).not.toContain("Brain fog");
    expect(body).not.toContain("Prefers mornings.");
    // But it should tell the reader where to find them.
    expect(body.toLowerCase()).toContain("secure admin dashboard");
  });
});
