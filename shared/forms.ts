import { z } from "zod";

/**
 * Shared validation schemas + types for the patient eligibility questionnaire
 * and the lead-capture form. Used by both the client (react-hook-form) and the
 * server (tRPC input validation) so the contract stays in sync.
 */

export const treatmentInterestEnum = z.enum(["eboo", "plasmapheresis", "both", "unsure"]);
export type TreatmentInterest = z.infer<typeof treatmentInterestEnum>;

/** EBO3 treatment volume tiers (drive duration + price on the EBO3 page). */
export const ebo3VolumeEnum = z.enum(["3L", "4.5L", "6L"]);
export type Ebo3Volume = z.infer<typeof ebo3VolumeEnum>;

export const workflowStatusEnum = z.enum(["new", "reviewing", "contacted", "scheduled", "closed"]);
export type WorkflowStatus = z.infer<typeof workflowStatusEnum>;

/** Conditions a patient can select interest/history in (non-diagnostic checklist). */
export const CONDITION_OPTIONS = [
  "Chronic fatigue / low energy",
  "Chronic inflammation",
  "Autoimmune condition",
  "Lyme disease / chronic infection",
  "Long COVID / post-viral syndrome",
  "Cardiovascular / circulation concerns",
  "High cholesterol / lipids",
  "Cognitive concerns (brain fog, memory)",
  "Mold / heavy metal / toxin exposure",
  "Neurological condition",
  "Longevity / healthy aging optimization",
  "Athletic recovery / performance",
] as const;

export const SYMPTOM_OPTIONS = [
  "Fatigue",
  "Brain fog",
  "Joint or muscle pain",
  "Poor sleep",
  "Frequent illness",
  "Shortness of breath",
  "Headaches",
  "Mood changes",
] as const;

export const GOAL_OPTIONS = [
  "Reduce inflammation",
  "Boost energy & vitality",
  "Support immune function",
  "Detoxification",
  "Cognitive clarity",
  "Cardiovascular support",
  "Longevity / healthy aging",
  "Recovery & performance",
] as const;

/**
 * Full questionnaire submission payload (PHI). Everything here is encrypted at
 * rest server-side; only `treatmentInterest` + consent booleans are mirrored to
 * plaintext columns for routing/filtering.
 */
export const questionnaireSchema = z.object({
  // Step 1 — health history
  age: z.coerce.number().int().min(18, "Patients must be 18 or older").max(120),
  biologicalSex: z.enum(["female", "male", "intersex", "prefer_not"]).optional(),
  knownG6PDDeficiency: z.enum(["yes", "no", "unsure"]),
  pregnantOrNursing: z.enum(["yes", "no", "na"]),
  bleedingOrClottingDisorder: z.enum(["yes", "no", "unsure"]),
  recentCardiacOrStrokeEvent: z.enum(["yes", "no", "unsure"]),
  currentMedications: z.string().max(2000).optional().default(""),
  // Step 2 — conditions
  conditions: z.array(z.string()).default([]),
  conditionsOther: z.string().max(1000).optional().default(""),
  // Step 3 — symptoms
  symptoms: z.array(z.string()).default([]),
  symptomDuration: z.enum(["lt1m", "1to6m", "6to12m", "gt12m", "na"]).optional(),
  // Step 4 — goals
  goals: z.array(z.string()).default([]),
  treatmentInterest: treatmentInterestEnum,
  ebo3Volume: z.enum(["3L", "4.5L", "6L"]).optional(),
  additionalNotes: z.string().max(2000).optional().default(""),
  // Step 5 — contact
  firstName: z.string().min(1, "First name is required").max(100),
  lastName: z.string().min(1, "Last name is required").max(100),
  email: z.string().email("A valid email is required").max(320),
  phone: z.string().min(7, "A valid phone number is required").max(40),
  preferredContact: z.enum(["email", "phone", "either"]).default("either"),
  city: z.string().max(120).optional().default(""),
  state: z.string().max(120).optional().default(""),
  // Consent — explicit, separate booleans (never bundled into submit)
  consentTreatmentInfo: z.literal(true, {
    message: "You must acknowledge the educational/treatment information notice.",
  }),
  consentPrivacy: z.literal(true, {
    message: "You must agree to the Privacy Policy to submit health information.",
  }),
  consentContact: z.literal(true, {
    message: "You must consent to be contacted about your inquiry.",
  }),
});

export type QuestionnaireInput = z.infer<typeof questionnaireSchema>;

/** Decrypted shape stored in the DB payload (consent stored as plain booleans). */
export type QuestionnairePayload = Omit<
  QuestionnaireInput,
  "consentTreatmentInfo" | "consentPrivacy" | "consentContact"
> & {
  consentTreatmentInfo: boolean;
  consentPrivacy: boolean;
  consentContact: boolean;
  submittedAt: number;
};

/** Lead-capture ("Talk to Our Team" / gated guide) payload. */
export const leadSchema = z.object({
  name: z.string().min(1, "Name is required").max(160),
  email: z.string().email("A valid email is required").max(320),
  phone: z.string().max(40).optional().default(""),
  treatmentInterest: treatmentInterestEnum.default("unsure"),
  message: z.string().max(2000).optional().default(""),
  source: z.string().max(64).optional().default("lead_form"),
  consentContact: z.literal(true, {
    message: "You must consent to be contacted.",
  }),
});

export type LeadInput = z.infer<typeof leadSchema>;

export type LeadPayload = Omit<LeadInput, "consentContact"> & {
  consentContact: boolean;
  submittedAt: number;
};

export const TREATMENT_INTEREST_LABELS: Record<TreatmentInterest, string> = {
  eboo: "EBO3 / EBOO",
  plasmapheresis: "Plasmapheresis",
  both: "Both treatments",
  unsure: "Not sure yet",
};

export const STATUS_LABELS: Record<WorkflowStatus, string> = {
  new: "New",
  reviewing: "Reviewing",
  contacted: "Contacted",
  scheduled: "Scheduled",
  closed: "Closed",
};
