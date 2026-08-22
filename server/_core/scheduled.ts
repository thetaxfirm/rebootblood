import type { Request, Response } from "express";
import { sdk, type AuthenticatedUser } from "./sdk";
import { syncLinkArtemis } from "./linkartemis";
import { upsertSyncedArticle } from "../db";
import { recordAudit } from "./audit";

/**
 * Project-level Heartbeat callback: daily auto-sync of LinkArtemis articles.
 *
 * Supports two auth modes:
 *   1. Manus Heartbeat: sdk.authenticateRequest → user.isCron + taskUid
 *   2. Vercel Cron: Authorization header matches CRON_SECRET env var
 *
 * Idempotent: re-running upserts by remoteId; safe for retries.
 */

function isVercelCronAuthorized(req: any): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = req.headers?.["authorization"] ?? "";
  return authHeader === `Bearer ${cronSecret}`;
}

export async function syncLinkArtemisScheduledHandler(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // Auth: accept either Manus Heartbeat cron OR Vercel CRON_SECRET
    let isAuthorized = false;
    let authSource = "unknown";

    // Try Vercel cron auth first (simpler, no async)
    if (isVercelCronAuthorized(req)) {
      isAuthorized = true;
      authSource = "vercel-cron";
    } else {
      // Fall back to Manus Heartbeat auth
      try {
        const user: AuthenticatedUser = await sdk.authenticateRequest(req);
        if (user.isCron && user.taskUid) {
          isAuthorized = true;
          authSource = "manus-heartbeat";
        }
      } catch {
        // Not authenticated via Manus either
      }
    }

    if (!isAuthorized) {
      res.status(403).json({ error: "cron-only" });
      return;
    }

    const summary = await syncLinkArtemis(upsertSyncedArticle);

    // Audit the automated sync (targetType "system"; no PHI involved).
    await recordAudit(
      { req, user: null },
      {
        action: "content.sync.scheduled",
        targetType: "system",
        detail:
          `source=${authSource} fetched=${summary.fetched} ` +
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
