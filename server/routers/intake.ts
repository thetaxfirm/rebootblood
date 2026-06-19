import { z } from "zod";
import { nanoid } from "nanoid";
import { TRPCError } from "@trpc/server";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { notifyOwner } from "../_core/notification";
import { recordAudit, requestIpHash } from "../_core/audit";
import { encryptJson, decryptJson } from "../_core/phi";
import {
  questionnaireSchema,
  leadSchema,
  workflowStatusEnum,
  treatmentInterestEnum,
  TREATMENT_INTEREST_LABELS,
  type QuestionnairePayload,
  type LeadPayload,
} from "@shared/forms";
import {
  insertQuestionnaireSubmission,
  listQuestionnaireSubmissions,
  getQuestionnaireSubmissionByPublicId,
  updateQuestionnaireStatus,
  insertLead,
  listLeads,
  getLeadByPublicId,
  updateLeadStatus,
  listAuditLogs,
  getDashboardCounts,
  insertTierEvent,
  getTierEventStats,
} from "../db";

const listFilterSchema = z.object({
  status: workflowStatusEnum.optional(),
  treatmentInterest: treatmentInterestEnum.optional(),
  sourceGroup: z.enum(["patient", "partner"]).optional(),
});

/* ----------------------------- Public intake ----------------------------- */

export const intakeRouter = router({
  /** Patient eligibility questionnaire submission (public). */
  submitQuestionnaire: publicProcedure
    .input(questionnaireSchema)
    .mutation(async ({ input, ctx }) => {
      const publicId = `Q-${nanoid(12)}`;
      const payload: QuestionnairePayload = {
        ...input,
        consentTreatmentInfo: true,
        consentPrivacy: true,
        consentContact: true,
        submittedAt: Date.now(),
      };

      await insertQuestionnaireSubmission({
        publicId,
        encryptedPayload: encryptJson(payload),
        treatmentInterest: input.treatmentInterest,
        consentTreatmentInfo: input.consentTreatmentInfo,
        consentPrivacy: input.consentPrivacy,
        consentContact: input.consentContact,
        submittedIpHash: requestIpHash(ctx),
      });

      await recordAudit(ctx, {
        action: "questionnaire.create",
        targetType: "questionnaire",
        targetId: publicId,
        detail: `interest=${input.treatmentInterest}`,
      });

      // Operational alert to clinic owner (no PHI in the body).
      void notifyOwner({
        title: "New patient eligibility submission",
        content: `A new eligibility questionnaire was submitted (ref ${publicId}). Interest: ${TREATMENT_INTEREST_LABELS[input.treatmentInterest]}. View securely in the admin dashboard.`,
      }).catch(() => undefined);

      return { success: true, reference: publicId } as const;
    }),

  /**
   * Record a lightweight tier-CTA conversion event (public, fire-and-forget).
   * No PII is captured — only the tier label, interest, action kind, and path.
   */
  recordTierEvent: publicProcedure
    .input(
      z.object({
        tier: z.string().trim().min(1).max(120),
        treatmentInterest: treatmentInterestEnum.default("unsure"),
        action: z.enum(["book", "check_eligibility"]),
        sourcePath: z.string().max(200).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      await insertTierEvent({
        tier: input.tier,
        treatmentInterest: input.treatmentInterest,
        action: input.action,
        sourcePath: input.sourcePath ?? null,
      });
      return { success: true } as const;
    }),

  /** Lead-capture form (public). Owner notification fires on EVERY submission. */
  submitLead: publicProcedure.input(leadSchema).mutation(async ({ input, ctx }) => {
    const publicId = `L-${nanoid(12)}`;
    const payload: LeadPayload = {
      ...input,
      consentContact: true,
      submittedAt: Date.now(),
    };

    const selectedTier = (input.selectedTier || "").trim();
    await insertLead({
      publicId,
      encryptedPayload: encryptJson(payload),
      source: input.source || "lead_form",
      treatmentInterest: input.treatmentInterest,
      selectedTier: selectedTier || null,
      consentContact: input.consentContact,
      submittedIpHash: requestIpHash(ctx),
    });

    await recordAudit(ctx, {
      action: "lead.create",
      targetType: "lead",
      targetId: publicId,
      detail: `source=${input.source || "lead_form"}`,
    });

    // HARD REQUIREMENT: owner notification on every lead submission.
    const delivered = await notifyOwner({
      title: "New lead — Talk to Our Team",
      content: `A new lead was captured (ref ${publicId}) with interest in ${TREATMENT_INTEREST_LABELS[input.treatmentInterest]}${selectedTier ? ` (tier: ${selectedTier})` : ""}. Open the admin dashboard to view contact details securely.`,
    }).catch(() => false);

    return { success: true, reference: publicId, notified: !!delivered } as const;
  }),
});

/* --------------------------- Admin (audited) --------------------------- */

export const adminRouter = router({
  dashboardCounts: adminProcedure.query(async () => {
    return getDashboardCounts();
  }),

  listSubmissions: adminProcedure.input(listFilterSchema).query(async ({ input, ctx }) => {
    const rows = await listQuestionnaireSubmissions(input);
    await recordAudit(ctx, {
      action: "questionnaire.list",
      targetType: "questionnaire",
      detail: `count=${rows.length}${input.status ? ` status=${input.status}` : ""}`,
    });
    // Return only non-PHI metadata in the list view (no decryption here).
    return rows.map((r) => ({
      publicId: r.publicId,
      treatmentInterest: r.treatmentInterest,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }),

  getSubmission: adminProcedure
    .input(z.object({ publicId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const row = await getQuestionnaireSubmissionByPublicId(input.publicId);
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      // Decryption = a PHI access event. Audit BEFORE returning.
      await recordAudit(ctx, {
        action: "questionnaire.view",
        targetType: "questionnaire",
        targetId: row.publicId,
      });
      const payload = decryptJson<QuestionnairePayload>(row.encryptedPayload);
      return {
        publicId: row.publicId,
        treatmentInterest: row.treatmentInterest,
        status: row.status,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        payload,
      };
    }),

  setSubmissionStatus: adminProcedure
    .input(z.object({ publicId: z.string().min(1), status: workflowStatusEnum }))
    .mutation(async ({ input, ctx }) => {
      await updateQuestionnaireStatus(input.publicId, input.status);
      await recordAudit(ctx, {
        action: "questionnaire.status",
        targetType: "questionnaire",
        targetId: input.publicId,
        detail: `status=${input.status}`,
      });
      return { success: true } as const;
    }),

  listLeads: adminProcedure.input(listFilterSchema).query(async ({ input, ctx }) => {
    const rows = await listLeads(input);
    await recordAudit(ctx, {
      action: "lead.list",
      targetType: "lead",
      detail: `count=${rows.length}`,
    });
    return rows.map((r) => ({
      publicId: r.publicId,
      treatmentInterest: r.treatmentInterest,
      status: r.status,
      source: r.source,
      selectedTier: r.selectedTier ?? "",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
    }));
  }),

  getLead: adminProcedure
    .input(z.object({ publicId: z.string().min(1) }))
    .query(async ({ input, ctx }) => {
      const row = await getLeadByPublicId(input.publicId);
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      await recordAudit(ctx, {
        action: "lead.view",
        targetType: "lead",
        targetId: row.publicId,
      });
      const payload = decryptJson<LeadPayload>(row.encryptedPayload);
      return {
        publicId: row.publicId,
        treatmentInterest: row.treatmentInterest,
        status: row.status,
        source: row.source,
        selectedTier: row.selectedTier ?? "",
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
        payload,
      };
    }),

  setLeadStatus: adminProcedure
    .input(z.object({ publicId: z.string().min(1), status: workflowStatusEnum }))
    .mutation(async ({ input, ctx }) => {
      await updateLeadStatus(input.publicId, input.status);
      await recordAudit(ctx, {
        action: "lead.status",
        targetType: "lead",
        targetId: input.publicId,
        detail: `status=${input.status}`,
      });
      return { success: true } as const;
    }),

  tierStats: adminProcedure
    .input(z.object({ range: z.enum(["7d", "30d", "90d", "all"]).default("all") }).optional())
    .query(async ({ input, ctx }) => {
      const range = input?.range ?? "all";
      const stats = await getTierEventStats(range);
      await recordAudit(ctx, {
        action: "tier.stats",
        targetType: "system",
        detail: `range=${range} tiers=${stats.length}`,
      });
      return stats;
    }),

  listAuditLogs: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(500).optional() }))
    .query(async ({ input, ctx }) => {
      const rows = await listAuditLogs(input.limit ?? 200);
      // Viewing the audit log is itself an auditable event.
      await recordAudit(ctx, {
        action: "audit.list",
        targetType: "system",
        detail: `count=${rows.length}`,
      });
      return rows;
    }),

  /** Audited CSV export. Decrypts PHI for the matching set — every export is logged. */
  exportSubmissions: adminProcedure
    .input(listFilterSchema)
    .mutation(async ({ input, ctx }) => {
      const rows = await listQuestionnaireSubmissions(input);
      await recordAudit(ctx, {
        action: "questionnaire.export",
        targetType: "questionnaire",
        detail: `count=${rows.length}${input.status ? ` status=${input.status}` : ""}`,
      });
      const records = rows.map((r) => {
        const p = decryptJson<QuestionnairePayload>(r.encryptedPayload);
        return {
          reference: r.publicId,
          status: r.status,
          interest: TREATMENT_INTEREST_LABELS[r.treatmentInterest],
          ebo3Volume: p.ebo3Volume ?? "",
          firstName: p.firstName,
          lastName: p.lastName,
          email: p.email,
          phone: p.phone,
          preferredContact: p.preferredContact,
          location: [p.city, p.state].filter(Boolean).join(" "),
          age: String(p.age ?? ""),
          knownG6PDDeficiency: p.knownG6PDDeficiency,
          pregnantOrNursing: p.pregnantOrNursing,
          bleedingOrClottingDisorder: p.bleedingOrClottingDisorder,
          recentCardiacOrStrokeEvent: p.recentCardiacOrStrokeEvent,
          medications: p.currentMedications ?? "",
          conditions: [...p.conditions, p.conditionsOther].filter(Boolean).join("; "),
          symptoms: p.symptoms.join("; "),
          symptomDuration: p.symptomDuration ?? "",
          goals: p.goals.join("; "),
          notes: p.additionalNotes ?? "",
          submittedAt: new Date(p.submittedAt).toISOString(),
        };
      });
      return { csv: toCsv(records), count: records.length } as const;
    }),

  exportLeads: adminProcedure
    .input(listFilterSchema)
    .mutation(async ({ input, ctx }) => {
      const rows = await listLeads(input);
      await recordAudit(ctx, {
        action: "lead.export",
        targetType: "lead",
        detail: `count=${rows.length}`,
      });
      const records = rows.map((r) => {
        const p = decryptJson<LeadPayload>(r.encryptedPayload);
        return {
          reference: r.publicId,
          status: r.status,
          source: r.source,
          interest: TREATMENT_INTEREST_LABELS[r.treatmentInterest],
          selectedTier: r.selectedTier ?? "",
          name: p.name,
          email: p.email,
          phone: p.phone ?? "",
          message: p.message ?? "",
          submittedAt: new Date(p.submittedAt).toISOString(),
        };
      });
      return { csv: toCsv(records), count: records.length } as const;
    }),
});

/** Minimal RFC-4180-ish CSV serializer. */
function toCsv(rows: Record<string, string>[]): string {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v: string) => {
    const s = v ?? "";
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\r\n");
}
