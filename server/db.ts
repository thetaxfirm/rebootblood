import { and, desc, eq, ne, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  questionnaireSubmissions,
  InsertQuestionnaireSubmission,
  leads,
  InsertLead,
  auditLogs,
  InsertAuditLog,
  tierEvents,
  InsertTierEvent,
} from "../drizzle/schema";
import { ENV } from './_core/env';

type WorkflowStatus = "new" | "reviewing" | "contacted" | "scheduled" | "closed";
type TreatmentInterest = "eboo" | "plasmapheresis" | "both" | "unsure";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/* --------------------- Questionnaire submissions --------------------- */

export async function insertQuestionnaireSubmission(data: InsertQuestionnaireSubmission) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(questionnaireSubmissions).values(data);
  const rows = await db
    .select()
    .from(questionnaireSubmissions)
    .where(eq(questionnaireSubmissions.publicId, data.publicId))
    .limit(1);
  return rows[0];
}

export interface SubmissionListFilter {
  status?: WorkflowStatus;
  treatmentInterest?: TreatmentInterest;
  /** Filter leads by source. "partner" = partner_inquiry only; "patient" = everything except partner_inquiry. */
  sourceGroup?: "patient" | "partner";
  limit?: number;
}

export async function listQuestionnaireSubmissions(filter: SubmissionListFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = [];
  if (filter.status) conditions.push(eq(questionnaireSubmissions.status, filter.status));
  if (filter.treatmentInterest)
    conditions.push(eq(questionnaireSubmissions.treatmentInterest, filter.treatmentInterest));
  const where = conditions.length ? and(...conditions) : undefined;
  return db
    .select()
    .from(questionnaireSubmissions)
    .where(where)
    .orderBy(desc(questionnaireSubmissions.createdAt))
    .limit(filter.limit ?? 200);
}

export async function getQuestionnaireSubmissionByPublicId(publicId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db
    .select()
    .from(questionnaireSubmissions)
    .where(eq(questionnaireSubmissions.publicId, publicId))
    .limit(1);
  return rows[0];
}

export async function updateQuestionnaireStatus(publicId: string, status: WorkflowStatus) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db
    .update(questionnaireSubmissions)
    .set({ status })
    .where(eq(questionnaireSubmissions.publicId, publicId));
}

/* ------------------------------- Leads ------------------------------- */

export async function insertLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leads).values(data);
  const rows = await db.select().from(leads).where(eq(leads.publicId, data.publicId)).limit(1);
  return rows[0];
}

/**
 * Pure predicate describing the source-group split used by the admin Leads view.
 * Kept standalone so it can be unit-tested without a database, and so the SQL
 * filter below and any in-memory checks share one definition of "partner".
 */
export function leadMatchesSourceGroup(source: string, group?: "patient" | "partner"): boolean {
  if (group === "partner") return source === "partner_inquiry";
  if (group === "patient") return source !== "partner_inquiry";
  return true;
}

export async function listLeads(filter: SubmissionListFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = [];
  if (filter.status) conditions.push(eq(leads.status, filter.status));
  if (filter.treatmentInterest) conditions.push(eq(leads.treatmentInterest, filter.treatmentInterest));
  if (filter.sourceGroup === "partner") conditions.push(eq(leads.source, "partner_inquiry"));
  if (filter.sourceGroup === "patient") conditions.push(ne(leads.source, "partner_inquiry"));
  const where = conditions.length ? and(...conditions) : undefined;
  return db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(filter.limit ?? 200);
}

export async function getLeadByPublicId(publicId: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(leads).where(eq(leads.publicId, publicId)).limit(1);
  return rows[0];
}

export async function updateLeadStatus(publicId: string, status: WorkflowStatus) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ status }).where(eq(leads.publicId, publicId));
}

/* ----------------------------- Audit logs ----------------------------- */

export async function insertAuditLog(data: InsertAuditLog) {
  const db = await getDb();
  if (!db) {
    console.error("[Audit] Database unavailable, audit event dropped:", data.action);
    return;
  }
  await db.insert(auditLogs).values(data);
}

export async function listAuditLogs(limit = 200) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
}

/* --------------------------- Tier conversion events --------------------------- */

export async function insertTierEvent(data: InsertTierEvent) {
  const db = await getDb();
  if (!db) {
    console.warn("[TierEvent] Database unavailable, event dropped:", data.tier);
    return;
  }
  await db.insert(tierEvents).values(data);
}

export type TierEventStat = {
  tier: string;
  treatmentInterest: TreatmentInterest;
  bookClicks: number;
  checkEligibilityClicks: number;
  total: number;
};

/** Selectable rolling windows for the tier-interest report. */
export type TierEventRange = "7d" | "30d" | "90d" | "all";

const RANGE_DAYS: Record<Exclude<TierEventRange, "all">, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * Pure: resolve a range to an inclusive cutoff timestamp (ms). Returns null for
 * "all" (no lower bound). `nowMs` is injectable so this is deterministic in tests.
 */
export function tierEventRangeStartMs(
  range: TierEventRange,
  nowMs: number = Date.now(),
): number | null {
  if (range === "all") return null;
  return nowMs - RANGE_DAYS[range] * 24 * 60 * 60 * 1000;
}

/** Aggregate tier-CTA clicks grouped by tier, split by action kind, within a window. */
export async function getTierEventStats(
  range: TierEventRange = "all",
): Promise<TierEventStat[]> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const startMs = tierEventRangeStartMs(range);
  const where =
    startMs === null ? undefined : sql`${tierEvents.createdAt} >= ${new Date(startMs)}`;
  const rows = await db
    .select({
      tier: tierEvents.tier,
      treatmentInterest: tierEvents.treatmentInterest,
      action: tierEvents.action,
      count: sql<number>`count(*)`,
    })
    .from(tierEvents)
    .where(where)
    .groupBy(tierEvents.tier, tierEvents.treatmentInterest, tierEvents.action);

  return aggregateTierEventRows(rows);
}

/** Pure aggregation of raw tier-event group rows into per-tier stats. Exported for testing. */
export function aggregateTierEventRows(
  rows: Array<{ tier: string; treatmentInterest: string; action: string; count: number }>,
): TierEventStat[] {
  const byTier = new Map<string, TierEventStat>();
  for (const r of rows) {
    const key = `${r.tier}\u0000${r.treatmentInterest}`;
    const entry =
      byTier.get(key) ??
      {
        tier: r.tier,
        treatmentInterest: r.treatmentInterest as TreatmentInterest,
        bookClicks: 0,
        checkEligibilityClicks: 0,
        total: 0,
      };
    const n = Number(r.count ?? 0);
    if (r.action === "book") entry.bookClicks += n;
    else if (r.action === "check_eligibility") entry.checkEligibilityClicks += n;
    entry.total += n;
    byTier.set(key, entry);
  }
  return Array.from(byTier.values()).sort((a, b) => b.total - a.total);
}

/* --------------------------- Dashboard stats --------------------------- */

export async function getDashboardCounts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [subTotal] = await db.select({ count: sql<number>`count(*)` }).from(questionnaireSubmissions);
  const [subNew] = await db
    .select({ count: sql<number>`count(*)` })
    .from(questionnaireSubmissions)
    .where(eq(questionnaireSubmissions.status, "new"));
  const [leadTotal] = await db.select({ count: sql<number>`count(*)` }).from(leads);
  const [leadNew] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(eq(leads.status, "new"));
  return {
    submissionsTotal: Number(subTotal?.count ?? 0),
    submissionsNew: Number(subNew?.count ?? 0),
    leadsTotal: Number(leadTotal?.count ?? 0),
    leadsNew: Number(leadNew?.count ?? 0),
  };
}
