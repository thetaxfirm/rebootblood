import { and, desc, eq, sql } from "drizzle-orm";
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

export async function listLeads(filter: SubmissionListFilter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = [];
  if (filter.status) conditions.push(eq(leads.status, filter.status));
  if (filter.treatmentInterest) conditions.push(eq(leads.treatmentInterest, filter.treatmentInterest));
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
