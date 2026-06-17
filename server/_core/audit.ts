import type { TrpcContext } from "./context";
import { insertAuditLog } from "../db";
import { hashForAudit } from "./phi";

/**
 * Central audit-logging helper. Every access to patient data (questionnaire
 * submissions and leads) MUST flow through here so the audit trail is complete.
 * IP addresses are hashed (one-way) so the log itself stores no raw PHI/PII.
 */
export async function recordAudit(
  ctx: Pick<TrpcContext, "req" | "user">,
  params: {
    action: string;
    targetType: "questionnaire" | "lead" | "system";
    targetId?: string | null;
    detail?: string | null;
  },
): Promise<void> {
  try {
    const xff = (ctx.req?.headers?.["x-forwarded-for"] as string | undefined) ?? "";
    const rawIp = xff.split(",")[0]?.trim() || ctx.req?.socket?.remoteAddress || "";
    const userAgent = (ctx.req?.headers?.["user-agent"] as string | undefined) ?? null;

    await insertAuditLog({
      actorUserId: ctx.user?.id ?? null,
      actorOpenId: ctx.user?.openId ?? null,
      actorName: ctx.user?.name ?? ctx.user?.email ?? null,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId ?? null,
      detail: params.detail ?? null,
      ipHash: hashForAudit(rawIp),
      userAgent,
    });
  } catch (err) {
    // Auditing failures must be visible but should not crash the request path.
    console.error("[Audit] Failed to record audit event:", params.action, err);
  }
}

/** Hash an inbound request's IP for non-PHI storage on submissions. */
export function requestIpHash(ctx: Pick<TrpcContext, "req">): string | null {
  const xff = (ctx.req?.headers?.["x-forwarded-for"] as string | undefined) ?? "";
  const rawIp = xff.split(",")[0]?.trim() || ctx.req?.socket?.remoteAddress || "";
  return hashForAudit(rawIp);
}
