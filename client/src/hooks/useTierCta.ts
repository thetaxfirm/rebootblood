import { useCallback } from "react";
import { trpc } from "@/lib/trpc";

export type TierCtaAction = "book" | "check_eligibility";
export type TierCtaInterest = "eboo" | "plasmapheresis" | "both" | "unsure";

/**
 * Returns a fire-and-forget click handler that records a lightweight tier-CTA
 * conversion event ("Book this tier" / "Check eligibility for this tier").
 *
 * It is intentionally non-blocking: the event is sent best-effort and any
 * failure is swallowed so navigation is never interrupted. No PII is sent —
 * only the tier label, treatment interest, action kind, and the current path.
 */
export function useTierCta() {
  const record = trpc.intake.recordTierEvent.useMutation();

  return useCallback(
    (tier: string, action: TierCtaAction, treatmentInterest: TierCtaInterest = "unsure") => {
      if (!tier) return;
      try {
        record.mutate({
          tier,
          action,
          treatmentInterest,
          sourcePath:
            typeof window !== "undefined" ? window.location.pathname : undefined,
        });
      } catch {
        // best-effort only
      }
    },
    [record],
  );
}
