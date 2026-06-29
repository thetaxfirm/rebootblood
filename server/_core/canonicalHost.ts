import type { Request, Response, NextFunction } from "express";

/**
 * Canonical host enforcement.
 *
 * We want `www.rebootblood.clinic` to be the single canonical host. Both the
 * apex (`rebootblood.clinic`) and `www` terminate at Manus hosting with valid
 * certs, but search engines should only see one. This pure helper decides
 * whether a request to the apex should be 301-redirected to the www host.
 *
 * Rules:
 * - Only the bare apex `rebootblood.clinic` (optionally with a port) is
 *   redirected to `www.rebootblood.clinic`, preserving path + query.
 * - `www.rebootblood.clinic` is left untouched (it is canonical).
 * - All other hosts (localhost, *.manus.space preview/deploy domains, etc.)
 *   are left untouched so dev/preview and the platform domains keep working.
 */

const APEX = "rebootblood.clinic";
const CANONICAL_HOST = "www.rebootblood.clinic";

/**
 * Given a Host header and the original request URL (path + query), return the
 * absolute https URL to redirect to, or `null` if no redirect is needed.
 */
export function canonicalRedirectTarget(
  hostHeader: string | undefined,
  originalUrl: string
): string | null {
  if (!hostHeader) return null;

  // Strip any port (e.g. "rebootblood.clinic:443") and normalize case.
  const host = hostHeader.split(":")[0]!.trim().toLowerCase();

  if (host !== APEX) return null;

  // Preserve the full path + query string exactly as received.
  const path = originalUrl || "/";
  return `https://${CANONICAL_HOST}${path}`;
}

export function canonicalHostRedirect(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const target = canonicalRedirectTarget(req.headers.host, req.originalUrl);
  if (target) {
    res.redirect(301, target);
    return;
  }
  next();
}
