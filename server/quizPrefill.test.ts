import { describe, expect, it } from "vitest";
import { computeQuizPrefill, TIER_NOTE_PREFIX } from "../shared/quizPrefill";

const CONDITIONS = ["Long COVID", "Autoimmune", "Chronic fatigue / low energy"];

describe("computeQuizPrefill — funnel pass-through", () => {
  it("maps a 'Check eligibility for this tier' EBO3 link to volume + interest + tier note", () => {
    const patch = computeQuizPrefill(
      "?interest=eboo&volume=4.5L&tier=EBO3%204.5L%20%E2%80%94%20Package%20of%203",
      CONDITIONS,
    );
    expect(patch.ebo3Volume).toBe("4.5L");
    expect(patch.treatmentInterest).toBe("eboo");
    expect(patch.notesLine).toBe(`${TIER_NOTE_PREFIX} EBO3 4.5L — Package of 3`);
  });

  it("maps a plasmapheresis tier link to interest + tier note (no volume)", () => {
    const patch = computeQuizPrefill(
      "?interest=plasmapheresis&tier=Plasmapheresis%20%E2%80%94%20Complete",
      CONDITIONS,
    );
    expect(patch.ebo3Volume).toBeUndefined();
    expect(patch.treatmentInterest).toBe("plasmapheresis");
    expect(patch.notesLine).toBe(`${TIER_NOTE_PREFIX} Plasmapheresis — Complete`);
  });

  it("lets an explicit interest override the volume-implied EBO3 interest", () => {
    const patch = computeQuizPrefill("?volume=6L&interest=both", CONDITIONS);
    expect(patch.ebo3Volume).toBe("6L");
    expect(patch.treatmentInterest).toBe("both");
  });

  it("defaults interest to eboo when only a volume is supplied", () => {
    const patch = computeQuizPrefill("?volume=3L", CONDITIONS);
    expect(patch.treatmentInterest).toBe("eboo");
  });

  it("adds a valid condition from the home hero selector", () => {
    const patch = computeQuizPrefill("?condition=Long%20COVID", CONDITIONS);
    expect(patch.addCondition).toBe("Long COVID");
  });

  it("ignores invalid/unknown params and returns an empty patch", () => {
    const patch = computeQuizPrefill("?interest=banana&volume=9L&condition=Nope&tier=", CONDITIONS);
    expect(patch).toEqual({});
  });
});
