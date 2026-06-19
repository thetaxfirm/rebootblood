/**
 * Pure helper that maps inbound URL query params (from "Book this tier" /
 * "Check eligibility for this tier" links and the home hero) into a partial
 * patch for the Eligibility quiz form state.
 *
 * Kept framework-free and side-effect-free so it can be unit tested and reused
 * by the Eligibility page effect. The page is responsible for merging this
 * patch into existing state (only filling empty fields, never overwriting user
 * input).
 */

export type TreatmentInterestParam = "eboo" | "plasmapheresis" | "both" | "unsure";

export type Ebo3VolumeParam = "3L" | "4.5L" | "6L";

export type QuizPrefillPatch = {
  /** Treatment interest to pre-select, if a valid value was provided. */
  treatmentInterest?: TreatmentInterestParam;
  /** EBO3 volume tier to pre-select, if a valid value was provided. */
  ebo3Volume?: Ebo3VolumeParam;
  /** A single condition slug to add to the selected conditions, if valid. */
  addCondition?: string;
  /** A line to prepend into additionalNotes recording the chosen pricing tier. */
  notesLine?: string;
  /** The raw tier label (for explicit display/confirmation in the UI). */
  tierLabel?: string;
};

const VALID_INTERESTS: readonly TreatmentInterestParam[] = [
  "eboo",
  "plasmapheresis",
  "both",
  "unsure",
];

const VALID_VOLUMES: readonly Ebo3VolumeParam[] = ["3L", "4.5L", "6L"];

export const TIER_NOTE_PREFIX = "Selected tier from website:";

/**
 * Compute the prefill patch from a query string (e.g. window.location.search)
 * or a URLSearchParams instance. `validConditions` is passed in so this stays
 * decoupled from the conditions catalog.
 */
export function computeQuizPrefill(
  search: string | URLSearchParams,
  validConditions: readonly string[] = [],
): QuizPrefillPatch {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  const patch: QuizPrefillPatch = {};

  const volume = params.get("volume");
  if (volume && (VALID_VOLUMES as readonly string[]).includes(volume)) {
    patch.ebo3Volume = volume as Ebo3VolumeParam;
    // A volume tier implies EBO3 interest unless an explicit interest overrides below.
    patch.treatmentInterest = "eboo";
  }

  const interest = params.get("interest");
  if (interest && (VALID_INTERESTS as readonly string[]).includes(interest)) {
    patch.treatmentInterest = interest as TreatmentInterestParam;
  }

  const tier = params.get("tier");
  if (tier && tier.trim()) {
    patch.tierLabel = tier.trim();
    patch.notesLine = `${TIER_NOTE_PREFIX} ${tier.trim()}`;
  }

  const condition = params.get("condition");
  if (condition && validConditions.includes(condition)) {
    patch.addCondition = condition;
  }

  return patch;
}
