import { describe, expect, it, vi, beforeEach } from "vitest";
import type { TrpcContext } from "./_core/context";

/* ---- Mock the DB layer so tests run without a live database ---- */
const store = {
  submissions: [] as any[],
  leads: [] as any[],
  audits: [] as any[],
};

vi.mock("./db", () => ({
  insertQuestionnaireSubmission: vi.fn(async (d: any) => {
    store.submissions.push(d);
    return d;
  }),
  listQuestionnaireSubmissions: vi.fn(async () => store.submissions),
  getQuestionnaireSubmissionByPublicId: vi.fn(async (id: string) =>
    store.submissions.find((s) => s.publicId === id),
  ),
  updateQuestionnaireStatus: vi.fn(async () => undefined),
  insertLead: vi.fn(async (d: any) => {
    store.leads.push(d);
    return d;
  }),
  listLeads: vi.fn(async () => store.leads),
  getLeadByPublicId: vi.fn(async (id: string) => store.leads.find((l) => l.publicId === id)),
  updateLeadStatus: vi.fn(async () => undefined),
  insertAuditLog: vi.fn(async (d: any) => {
    store.audits.push(d);
  }),
  listAuditLogs: vi.fn(async () => store.audits),
  getDashboardCounts: vi.fn(async () => ({
    submissionsTotal: store.submissions.length,
    submissionsNew: store.submissions.length,
    leadsTotal: store.leads.length,
    leadsNew: store.leads.length,
  })),
}));

/* ---- Mock owner notification to assert it fires ---- */
const notifyOwnerMock = vi.fn(async () => true);
vi.mock("./_core/notification", () => ({
  notifyOwner: (...args: any[]) => notifyOwnerMock(...args),
}));

import { appRouter } from "./routers";

function makeCtx(role: "user" | "admin" | null): TrpcContext {
  const user =
    role === null
      ? null
      : {
          id: 1,
          openId: "actor-1",
          email: "staff@clinic.com",
          name: "Staff Member",
          loginMethod: "manus",
          role,
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        };
  return {
    user: user as TrpcContext["user"],
    req: { headers: { "user-agent": "vitest" }, socket: { remoteAddress: "203.0.113.9" } } as any,
    res: {} as any,
  };
}

const validQuestionnaire = {
  age: 45,
  biologicalSex: "female" as const,
  knownG6PDDeficiency: "no" as const,
  pregnantOrNursing: "no" as const,
  bleedingOrClottingDisorder: "no" as const,
  recentCardiacOrStrokeEvent: "no" as const,
  currentMedications: "none",
  conditions: ["Chronic fatigue / low energy"],
  conditionsOther: "",
  symptoms: ["Fatigue"],
  symptomDuration: "6to12m" as const,
  goals: ["Boost energy & vitality"],
  treatmentInterest: "eboo" as const,
  additionalNotes: "",
  firstName: "Jane",
  lastName: "Doe",
  email: "jane@example.com",
  phone: "5551234567",
  preferredContact: "either" as const,
  city: "Austin",
  state: "TX",
  consentTreatmentInfo: true as const,
  consentPrivacy: true as const,
  consentContact: true as const,
};

beforeEach(() => {
  store.submissions.length = 0;
  store.leads.length = 0;
  store.audits.length = 0;
  notifyOwnerMock.mockClear();
});

describe("intake — public submissions", () => {
  it("encrypts questionnaire PHI at rest (no plaintext name/email in stored payload)", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const res = await caller.intake.submitQuestionnaire(validQuestionnaire);
    expect(res.success).toBe(true);
    const stored = store.submissions[0];
    expect(stored.encryptedPayload).toBeTruthy();
    expect(stored.encryptedPayload).not.toContain("Jane");
    expect(stored.encryptedPayload).not.toContain("jane@example.com");
    // non-PHI routing metadata is plaintext
    expect(stored.treatmentInterest).toBe("eboo");
    // creation is audited
    expect(store.audits.some((a) => a.action === "questionnaire.create")).toBe(true);
  });

  it("fires an owner notification on every lead submission", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    const res = await caller.intake.submitLead({
      name: "John Smith",
      email: "john@example.com",
      phone: "5559876543",
      treatmentInterest: "plasmapheresis",
      message: "Interested",
      source: "lead_form",
      consentContact: true,
    });
    expect(res.success).toBe(true);
    expect(notifyOwnerMock).toHaveBeenCalledTimes(1);
    expect(store.leads[0].encryptedPayload).not.toContain("john@example.com");
  });

  it("rejects a questionnaire missing explicit consent", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(
      caller.intake.submitQuestionnaire({ ...validQuestionnaire, consentPrivacy: false as any }),
    ).rejects.toThrow();
  });
});

describe("admin — RBAC + audit", () => {
  it("blocks anonymous users from listing submissions", async () => {
    const caller = appRouter.createCaller(makeCtx(null));
    await expect(caller.admin.listSubmissions({})).rejects.toThrow();
  });

  it("blocks non-admin authenticated users", async () => {
    const caller = appRouter.createCaller(makeCtx("user"));
    await expect(caller.admin.listSubmissions({})).rejects.toThrow();
  });

  it("allows admins and writes an audit log on view (PHI access)", async () => {
    const anon = appRouter.createCaller(makeCtx(null));
    const created = await anon.intake.submitQuestionnaire(validQuestionnaire);

    const admin = appRouter.createCaller(makeCtx("admin"));
    const detail = await admin.admin.getSubmission({ publicId: created.reference });
    expect(detail.payload.firstName).toBe("Jane");
    expect(detail.payload.email).toBe("jane@example.com");
    expect(store.audits.some((a) => a.action === "questionnaire.view" && a.targetId === created.reference)).toBe(
      true,
    );
  });

  it("list view returns only non-PHI metadata", async () => {
    const anon = appRouter.createCaller(makeCtx(null));
    await anon.intake.submitQuestionnaire(validQuestionnaire);
    const admin = appRouter.createCaller(makeCtx("admin"));
    const list = await admin.admin.listSubmissions({});
    expect(list[0]).not.toHaveProperty("payload");
    expect(list[0]).not.toHaveProperty("encryptedPayload");
    expect(list[0]).toHaveProperty("treatmentInterest");
  });
});
