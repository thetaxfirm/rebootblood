import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Patient eligibility questionnaire submissions.
 *
 * HIPAA-alignment: ALL personally identifiable / protected health information
 * is stored ONLY inside `encryptedPayload`, an AES-256-GCM encrypted JSON blob
 * (see server/_core/phi.ts). No PHI is stored in plaintext columns.
 *
 * Non-PHI operational metadata (status, treatment interest, timestamps) is kept
 * in plaintext to allow filtering/sorting without decrypting individual records.
 */
export const questionnaireSubmissions = mysqlTable("questionnaire_submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** Public reference id (non-sequential) shown to staff; safe to display. */
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  /** AES-256-GCM encrypted JSON containing all answers + contact PHI. */
  encryptedPayload: text("encryptedPayload").notNull(),
  /** Which treatment the patient is primarily interested in (non-PHI, for routing). */
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"])
    .default("unsure")
    .notNull(),
  /** Workflow status for clinic staff (non-PHI). */
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "scheduled", "closed"])
    .default("new")
    .notNull(),
  /** Consent flags captured explicitly at submission time (non-PHI booleans). */
  consentTreatmentInfo: boolean("consentTreatmentInfo").default(false).notNull(),
  consentPrivacy: boolean("consentPrivacy").default(false).notNull(),
  consentContact: boolean("consentContact").default(false).notNull(),
  /** Coarse origin metadata for audit (hashed, no precise tracking). */
  submittedIpHash: varchar("submittedIpHash", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuestionnaireSubmission = typeof questionnaireSubmissions.$inferSelect;
export type InsertQuestionnaireSubmission = typeof questionnaireSubmissions.$inferInsert;

/**
 * Lead-capture submissions ("Talk to Our Team" / gated guide).
 * Contact PII is encrypted at rest in `encryptedPayload`.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  /** AES-256-GCM encrypted JSON containing name, email, phone, message, etc. */
  encryptedPayload: text("encryptedPayload").notNull(),
  /** Non-PHI routing/source metadata. */
  source: varchar("source", { length: 64 }).default("lead_form").notNull(),
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"])
    .default("unsure")
    .notNull(),
  /** Pricing tier the lead clicked "Book this tier" from (non-PHI, for routing/triage). */
  selectedTier: varchar("selectedTier", { length: 120 }),
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "scheduled", "closed"])
    .default("new")
    .notNull(),
  consentContact: boolean("consentContact").default(false).notNull(),
  submittedIpHash: varchar("submittedIpHash", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

/**
 * Immutable audit log. A row is written for EVERY access event involving
 * patient data (list, view/decrypt, export, status change). This is a core
 * HIPAA-alignment control. Rows are append-only by convention.
 */
export const auditLogs = mysqlTable("audit_logs", {
  id: int("id").autoincrement().primaryKey(),
  /** Acting user (admin) id; null only for system/anonymous events. */
  actorUserId: int("actorUserId"),
  actorOpenId: varchar("actorOpenId", { length: 64 }),
  actorName: text("actorName"),
  /** What happened, e.g. "submission.view", "submission.list", "lead.view". */
  action: varchar("action", { length: 64 }).notNull(),
  /** Entity type the action targeted: "questionnaire" | "lead" | "system". */
  targetType: varchar("targetType", { length: 32 }).notNull(),
  /** Public id / identifier of the targeted entity (non-PHI). */
  targetId: varchar("targetId", { length: 64 }),
  /** Optional non-PHI detail (e.g. filter used, count returned, new status). */
  detail: text("detail"),
  ipHash: varchar("ipHash", { length: 64 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

/**
 * Lightweight, privacy-safe conversion events fired when a visitor clicks a
 * "Book this tier" or "Check eligibility for this tier" CTA on a pricing card.
 * No PII is stored — only the tier label, the treatment interest, the action
 * kind, and the originating page path. Used to measure which tiers drive intent.
 */
export const tierEvents = mysqlTable("tier_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Pricing tier label, e.g. "EBO3 4.5L — Package of 3" or "Plasmapheresis — Complete". */
  tier: varchar("tier", { length: 120 }).notNull(),
  /** Treatment interest associated with the tier (non-PHI). */
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"])
    .default("unsure")
    .notNull(),
  /** Which CTA was used. */
  action: mysqlEnum("action", ["book", "check_eligibility"]).notNull(),
  /** Page path the click originated from (non-PHI, e.g. "/eboo"). */
  sourcePath: varchar("sourcePath", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TierEvent = typeof tierEvents.$inferSelect;
export type InsertTierEvent = typeof tierEvents.$inferInsert;


/**
 * Articles synced from LinkArtemis (app.linkartemis.com) AI SEO platform.
 *
 * These are PUBLIC marketing/education articles (no PHI). The integration is
 * review-before-publish: a sync pulls completed LinkArtemis articles in as
 * `pending`; an admin must explicitly `published` them before they appear in
 * the public Learning Center. `hidden` lets an admin pull a published article
 * back without deleting the synced copy.
 *
 * `remoteId` is the LinkArtemis article UUID — the idempotency key for sync
 * upserts (never look up by slug/title for sync). `contentHtml` stores the
 * sanitized article body (sanitization happens before insert/update).
 */
export const syncedArticles = mysqlTable("synced_articles", {
  id: int("id").autoincrement().primaryKey(),
  /** Upstream provider, currently always "linkartemis". */
  source: varchar("source", { length: 32 }).default("linkartemis").notNull(),
  /** Upstream article id (UUID). Unique idempotency key for sync upserts. */
  remoteId: varchar("remoteId", { length: 64 }).notNull().unique(),
  /** URL slug used under /learn/:slug. Unique across synced articles. */
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  metaDescription: text("metaDescription"),
  heroImageUrl: text("heroImageUrl"),
  /** JSON-encoded string[] of keywords from the provider. */
  keywords: text("keywords"),
  languageCode: varchar("languageCode", { length: 16 }),
  /** Sanitized HTML body (allowlisted tags only; no scripts). */
  contentHtml: text("contentHtml").notNull(),
  /** Review workflow status. Articles are never public until "published". */
  status: mysqlEnum("status", ["pending", "published", "hidden"]).default("pending").notNull(),
  /** Provider-reported creation time (ISO string preserved as ms epoch). */
  remoteCreatedAt: timestamp("remoteCreatedAt"),
  /** When an admin first moved this article to "published". */
  publishedAt: timestamp("publishedAt"),
  /** Last time the sync touched this row. */
  lastSyncedAt: timestamp("lastSyncedAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type SyncedArticle = typeof syncedArticles.$inferSelect;
export type InsertSyncedArticle = typeof syncedArticles.$inferInsert;
