import type { Request, Response } from "express";
import { sdk } from "./sdk";
import { syncLinkArtemis } from "./linkartemis";
import { upsertSyncedArticle } from "../db";
import { recordAudit } from "./audit";
import type { AuthenticatedUser } from "./sdk";

/**
 * Project-level Heartbeat callback: daily auto-sync of LinkArtemis articles.
 *
 * The platform POSTs here on the cron schedule (see references/periodic-updates.md).
 * It runs the same sync the admin "Sync now" button uses — a single API pull +
 * idempotent DB upsert. New articles land as "pending"; existing rows keep their
 * review status, so nothing is ever auto-published.
 *
 * Contract notes:
 *  - Auth: only cron-authenticated requests (`user.isCron`) may trigger it.
 *  - Idempotent: re-running upserts by remoteId; safe for the platform's retries.
 *  - Errors: 500 returns a JSON-encoded error so the platform Investigate flow
 *    can surface it verbatim. 5xx/429 are retried up to 3 times by the platform.
 */
export async function syncLinkArtemisScheduledHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    let user: AuthenticatedUser;
    try {
      user = await sdk.authenticateRequest(req);
    } catch {
      res.status(403).json({ error: "cron-only" });
      return;
    }
    if (!user.isCron || !user.taskUid) {
      res.status(403).json({ error: "cron-only" });
      return;
    }

    const summary = await syncLinkArtemis(upsertSyncedArticle);

    // Audit the automated sync (targetType "system"; no PHI involved).
    await recordAudit(
      { req, user },
      {
        action: "content.sync.scheduled",
        targetType: "system",
        detail:
          `taskUid=${user.taskUid} fetched=${summary.fetched} ` +
          `inserted=${summary.inserted} updated=${summary.updated} ` +
          `skipped=${summary.skipped} errors=${summary.errors.length}`,
      },
    );

    res.json({ ok: true, summary });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    res.status(500).json({
      error,
      stack,
      context: { url: req.originalUrl, taskUid: (req.body && req.body.taskUid) ?? null },
      timestamp: new Date().toISOString(),
    });
  }
}
