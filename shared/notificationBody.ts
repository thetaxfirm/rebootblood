import {
  TREATMENT_INTEREST_LABELS,
  type LeadPayload,
  type QuestionnairePayload,
} from "./forms";

/**
 * Pure formatters that build the human-readable owner-notification body for each
 * inbound submission type.
 *
 * Policy (Option 1, chosen by the clinic owner): notifications include the
 * customer's CONTACT details and INTENT (so the care team can act without
 * logging in), but DELIBERATELY EXCLUDE the sensitive clinical
 * health-screening answers from the eligibility questionnaire (G6PD status,
 * pregnancy, bleeding/clotting disorder, recent cardiac/stroke event,
 * medications, conditions, symptoms). Those remain only in the encrypted,
 * audited admin dashboard. Email/notification channels are not a secure place
 * for clinical PHI.
 *
 * These functions are pure (no I/O) so they can be unit-tested directly.
 */

const PREFERRED_CONTACT_LABELS: Record<string, string> = {
  email: "Email",
  phone: "Phone",
  either: "Either",
};

function line(label: string, value: string | number | null | undefined): string | null {
  if (value === null || value === undefined) return null;
  const v = String(value).trim();
  if (!v) return null;
  return `${label}: ${v}`;
}

/** Owner-notification body for a lead / "Book Consultation" / guide submission. */
export function formatLeadNotification(args: {
  publicId: string;
  payload: LeadPayload;
  source: string;
  selectedTier: string | null;
}): string {
  const { publicId, payload, source, selectedTier } = args;
  const lines: (string | null)[] = [
    "A new lead was submitted via the website.",
    "",
    line("Reference", publicId),
    line("Name", payload.name),
    line("Email", payload.email),
    line("Phone", payload.phone),
    line("Treatment interest", TREATMENT_INTEREST_LABELS[payload.treatmentInterest]),
    line("Selected tier", selectedTier),
    line("Source", source),
    line("Message", payload.message),
    "",
    "Manage and update status in the secure admin dashboard.",
  ];
  return lines.filter((l) => l !== null).join("\n");
}

/**
 * Owner-notification body for an eligibility questionnaire submission.
 * Contact + intent only — health-screening answers are intentionally omitted.
 */
export function formatQuestionnaireNotification(args: {
  publicId: string;
  payload: QuestionnairePayload;
}): string {
  const { publicId, payload } = args;
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
  const location = [payload.city, payload.state].filter(Boolean).join(", ");
  const preferred = payload.preferredContact
    ? PREFERRED_CONTACT_LABELS[payload.preferredContact] ?? payload.preferredContact
    : "";
  const goals = Array.isArray(payload.goals) ? payload.goals.filter(Boolean).join("; ") : "";

  const lines: (string | null)[] = [
    "A new eligibility questionnaire was submitted via the website.",
    "",
    line("Reference", publicId),
    line("Name", fullName),
    line("Email", payload.email),
    line("Phone", payload.phone),
    line("Preferred contact", preferred),
    line("Location", location),
    line("Age", payload.age),
    line("Treatment interest", TREATMENT_INTEREST_LABELS[payload.treatmentInterest]),
    line("EBO3 volume", payload.ebo3Volume),
    line("Goals", goals),
    "",
    "Health screening answers are not included here for privacy. View the full,",
    "encrypted submission in the secure admin dashboard.",
  ];
  return lines.filter((l) => l !== null).join("\n");
}
