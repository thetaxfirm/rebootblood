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
} from "../db";

const listFilterSchema = z.object({
  status: workflowStatusEnum.optional(),
  treatmentInterest: treatmentInterestEnum.optional(),
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

  /** Lead-capture form (public). Owner notification fires on EVERY submission. */
  submitLead: publicProcedure.input(leadSchema).mutation(async ({ input, ctx }) => {
    const publicId = `L-${nanoid(12)}`;
    const payload: LeadPayload = {
      ...input,
      consentContact: true,
      submittedAt: Date.now(),
    };

    await insertLead({
      publicId,
      encryptedPayload: encryptJson(payload),
      source: input.source || "lead_form",
      treatmentInterest: input.treatmentInterest,
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
      content: `A new lead was captured (ref ${publicId}) with interest in ${TREATMENT_INTEREST_LABELS[input.treatmentInterest]}. Open the admin dashboard to view contact details securely.`,
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
});
