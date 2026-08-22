// server/_core/index.ts
import "dotenv/config";
import express2 from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

// server/_core/oauth.ts
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

// server/db.ts
import { and, desc, eq, ne, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";

// drizzle/schema.ts
import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";
var users = mysqlTable("users", {
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
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull()
});
var questionnaireSubmissions = mysqlTable("questionnaire_submissions", {
  id: int("id").autoincrement().primaryKey(),
  /** Public reference id (non-sequential) shown to staff; safe to display. */
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  /** AES-256-GCM encrypted JSON containing all answers + contact PHI. */
  encryptedPayload: text("encryptedPayload").notNull(),
  /** Which treatment the patient is primarily interested in (non-PHI, for routing). */
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"]).default("unsure").notNull(),
  /** Workflow status for clinic staff (non-PHI). */
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "scheduled", "closed"]).default("new").notNull(),
  /** Consent flags captured explicitly at submission time (non-PHI booleans). */
  consentTreatmentInfo: boolean("consentTreatmentInfo").default(false).notNull(),
  consentPrivacy: boolean("consentPrivacy").default(false).notNull(),
  consentContact: boolean("consentContact").default(false).notNull(),
  /** Coarse origin metadata for audit (hashed, no precise tracking). */
  submittedIpHash: varchar("submittedIpHash", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  publicId: varchar("publicId", { length: 32 }).notNull().unique(),
  /** AES-256-GCM encrypted JSON containing name, email, phone, message, etc. */
  encryptedPayload: text("encryptedPayload").notNull(),
  /** Non-PHI routing/source metadata. */
  source: varchar("source", { length: 64 }).default("lead_form").notNull(),
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"]).default("unsure").notNull(),
  /** Pricing tier the lead clicked "Book this tier" from (non-PHI, for routing/triage). */
  selectedTier: varchar("selectedTier", { length: 120 }),
  status: mysqlEnum("status", ["new", "reviewing", "contacted", "scheduled", "closed"]).default("new").notNull(),
  consentContact: boolean("consentContact").default(false).notNull(),
  submittedIpHash: varchar("submittedIpHash", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});
var auditLogs = mysqlTable("audit_logs", {
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
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var tierEvents = mysqlTable("tier_events", {
  id: int("id").autoincrement().primaryKey(),
  /** Pricing tier label, e.g. "EBO3 4.5L — Package of 3" or "Plasmapheresis — Complete". */
  tier: varchar("tier", { length: 120 }).notNull(),
  /** Treatment interest associated with the tier (non-PHI). */
  treatmentInterest: mysqlEnum("treatmentInterest", ["eboo", "plasmapheresis", "both", "unsure"]).default("unsure").notNull(),
  /** Which CTA was used. */
  action: mysqlEnum("action", ["book", "check_eligibility"]).notNull(),
  /** Page path the click originated from (non-PHI, e.g. "/eboo"). */
  sourcePath: varchar("sourcePath", { length: 200 }),
  createdAt: timestamp("createdAt").defaultNow().notNull()
});
var syncedArticles = mysqlTable("synced_articles", {
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
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull()
});

// server/_core/env.ts
var ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  /**
   * Application-layer encryption key for PHI (protected health information).
   * Must be a 64-char hex string (32 bytes) for AES-256-GCM.
   * Falls back to JWT_SECRET-derived key in dev if unset (NOT for production PHI).
   */
  phiEncryptionKey: process.env.PHI_ENCRYPTION_KEY ?? "",
  /** app.linkartemis.com API key (X-API-Key) for the server-side article sync. */
  linkArtemisApiKey: process.env.LINKARTEMIS_API_KEY ?? "",
  /** LinkArtemis API base URL (override via env for testing if ever needed). */
  linkArtemisApiUrl: process.env.LINKARTEMIS_API_URL ?? "https://app.linkartemis.com/api/v1",
  /** GoDaddy production API key (sso-key id), server-side only. */
  godaddyApiKey: process.env.GODADDY_API_KEY ?? "",
  /** GoDaddy production API secret, server-side only. */
  godaddyApiSecret: process.env.GODADDY_API_SECRET ?? "",
  /** GoDaddy API base URL (production by default; OTE endpoint can be set for testing). */
  godaddyApiUrl: process.env.GODADDY_API_URL ?? "https://api.godaddy.com",
  /** SMTP sender address (Google Workspace). */
  smtpUser: process.env.SMTP_USER ?? "",
  /** Google App Password for SMTP authentication. */
  smtpAppPassword: process.env.SMTP_APP_PASSWORD ?? "",
  /** Google OAuth 2.0 Client ID for admin login. */
  googleClientId: process.env.GOOGLE_CLIENT_ID ?? "",
  /** Google OAuth 2.0 Client Secret for admin login. */
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
};

// server/db.ts
var _db = null;
async function getDb() {
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
async function promoteToAdmin(openId) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role: "admin" }).where(eq(users.openId, openId));
}
async function upsertUser(user) {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }
  try {
    const values = {
      openId: user.openId
    };
    const updateSet = {};
    const textFields = ["name", "email", "loginMethod"];
    const assignNullable = (field) => {
      const value = user[field];
      if (value === void 0) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== void 0) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== void 0) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) {
      values.lastSignedIn = /* @__PURE__ */ new Date();
    }
    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = /* @__PURE__ */ new Date();
    }
    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}
async function getUserByOpenId(openId) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return void 0;
  }
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : void 0;
}
async function insertQuestionnaireSubmission(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(questionnaireSubmissions).values(data);
  const rows = await db.select().from(questionnaireSubmissions).where(eq(questionnaireSubmissions.publicId, data.publicId)).limit(1);
  return rows[0];
}
async function listQuestionnaireSubmissions(filter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = [];
  if (filter.status) conditions.push(eq(questionnaireSubmissions.status, filter.status));
  if (filter.treatmentInterest)
    conditions.push(eq(questionnaireSubmissions.treatmentInterest, filter.treatmentInterest));
  const where = conditions.length ? and(...conditions) : void 0;
  return db.select().from(questionnaireSubmissions).where(where).orderBy(desc(questionnaireSubmissions.createdAt)).limit(filter.limit ?? 200);
}
async function getQuestionnaireSubmissionByPublicId(publicId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(questionnaireSubmissions).where(eq(questionnaireSubmissions.publicId, publicId)).limit(1);
  return rows[0];
}
async function updateQuestionnaireStatus(publicId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(questionnaireSubmissions).set({ status }).where(eq(questionnaireSubmissions.publicId, publicId));
}
async function insertLead(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(leads).values(data);
  const rows = await db.select().from(leads).where(eq(leads.publicId, data.publicId)).limit(1);
  return rows[0];
}
async function listLeads(filter = {}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const conditions = [];
  if (filter.status) conditions.push(eq(leads.status, filter.status));
  if (filter.treatmentInterest) conditions.push(eq(leads.treatmentInterest, filter.treatmentInterest));
  if (filter.sourceGroup === "partner") conditions.push(eq(leads.source, "partner_inquiry"));
  if (filter.sourceGroup === "patient") conditions.push(ne(leads.source, "partner_inquiry"));
  const where = conditions.length ? and(...conditions) : void 0;
  return db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(filter.limit ?? 200);
}
async function getLeadByPublicId(publicId) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(leads).where(eq(leads.publicId, publicId)).limit(1);
  return rows[0];
}
async function updateLeadStatus(publicId, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set({ status }).where(eq(leads.publicId, publicId));
}
async function insertAuditLog(data) {
  const db = await getDb();
  if (!db) {
    console.error("[Audit] Database unavailable, audit event dropped:", data.action);
    return;
  }
  await db.insert(auditLogs).values(data);
}
async function listAuditLogs(limit = 200) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(auditLogs).orderBy(desc(auditLogs.createdAt)).limit(limit);
}
async function insertTierEvent(data) {
  const db = await getDb();
  if (!db) {
    console.warn("[TierEvent] Database unavailable, event dropped:", data.tier);
    return;
  }
  await db.insert(tierEvents).values(data);
}
var RANGE_DAYS = {
  "7d": 7,
  "30d": 30,
  "90d": 90
};
function tierEventRangeStartMs(range, nowMs = Date.now()) {
  if (range === "all") return null;
  return nowMs - RANGE_DAYS[range] * 24 * 60 * 60 * 1e3;
}
async function getTierEventStats(range = "all") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const startMs = tierEventRangeStartMs(range);
  const where = startMs === null ? void 0 : sql`${tierEvents.createdAt} >= ${new Date(startMs)}`;
  const rows = await db.select({
    tier: tierEvents.tier,
    treatmentInterest: tierEvents.treatmentInterest,
    action: tierEvents.action,
    count: sql`count(*)`
  }).from(tierEvents).where(where).groupBy(tierEvents.tier, tierEvents.treatmentInterest, tierEvents.action);
  return aggregateTierEventRows(rows);
}
function aggregateTierEventRows(rows) {
  const byTier = /* @__PURE__ */ new Map();
  for (const r of rows) {
    const key = `${r.tier}\0${r.treatmentInterest}`;
    const entry = byTier.get(key) ?? {
      tier: r.tier,
      treatmentInterest: r.treatmentInterest,
      bookClicks: 0,
      checkEligibilityClicks: 0,
      total: 0
    };
    const n = Number(r.count ?? 0);
    if (r.action === "book") entry.bookClicks += n;
    else if (r.action === "check_eligibility") entry.checkEligibilityClicks += n;
    entry.total += n;
    byTier.set(key, entry);
  }
  return Array.from(byTier.values()).sort((a, b) => b.total - a.total);
}
async function getDashboardCounts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const [subTotal] = await db.select({ count: sql`count(*)` }).from(questionnaireSubmissions);
  const [subNew] = await db.select({ count: sql`count(*)` }).from(questionnaireSubmissions).where(eq(questionnaireSubmissions.status, "new"));
  const [leadTotal] = await db.select({ count: sql`count(*)` }).from(leads);
  const [leadNew] = await db.select({ count: sql`count(*)` }).from(leads).where(eq(leads.status, "new"));
  return {
    submissionsTotal: Number(subTotal?.count ?? 0),
    submissionsNew: Number(subNew?.count ?? 0),
    leadsTotal: Number(leadTotal?.count ?? 0),
    leadsNew: Number(leadNew?.count ?? 0)
  };
}
async function upsertSyncedArticle(data) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const now = /* @__PURE__ */ new Date();
  const existing = await db.select({ id: syncedArticles.id, publishedAt: syncedArticles.publishedAt }).from(syncedArticles).where(eq(syncedArticles.remoteId, data.remoteId)).limit(1);
  if (existing.length) {
    await db.update(syncedArticles).set({
      slug: data.slug,
      title: data.title,
      excerpt: data.excerpt,
      metaDescription: data.metaDescription,
      heroImageUrl: data.heroImageUrl,
      keywords: data.keywords,
      languageCode: data.languageCode,
      contentHtml: data.contentHtml,
      remoteCreatedAt: data.remoteCreatedAt,
      lastSyncedAt: now,
      status: "published",
      // Preserve the original publish time; only set it if missing.
      publishedAt: existing[0].publishedAt ?? now
    }).where(eq(syncedArticles.remoteId, data.remoteId));
    return "updated";
  }
  await db.insert(syncedArticles).values({ ...data, status: "published", publishedAt: data.publishedAt ?? now });
  return "inserted";
}
async function listSyncedArticles(status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const where = status ? eq(syncedArticles.status, status) : void 0;
  return db.select().from(syncedArticles).where(where).orderBy(desc(syncedArticles.createdAt)).limit(500);
}
async function getSyncedArticleById(id) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(syncedArticles).where(eq(syncedArticles.id, id)).limit(1);
  return rows[0];
}
async function listPublishedSyncedArticles() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.select().from(syncedArticles).where(eq(syncedArticles.status, "published")).orderBy(desc(syncedArticles.publishedAt));
}
async function getPublishedSyncedArticleBySlug(slug) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const rows = await db.select().from(syncedArticles).where(and(eq(syncedArticles.slug, slug), eq(syncedArticles.status, "published"))).limit(1);
  return rows[0];
}
async function setSyncedArticleStatus(id, status) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const current = await getSyncedArticleById(id);
  const set = { status };
  if (status === "published" && current && !current.publishedAt) {
    set.publishedAt = /* @__PURE__ */ new Date();
  }
  await db.update(syncedArticles).set(set).where(eq(syncedArticles.id, id));
}

// server/_core/oauth.ts
var ADMIN_EMAILS = /* @__PURE__ */ new Set([
  "care@rebootblood.clinic"
  // Add more admin emails here as needed
]);
function registerOAuthRoutes(app2) {
  app2.use(
    session({
      secret: ENV.cookieSecret || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: ENV.isProduction,
        sameSite: ENV.isProduction ? "none" : "lax",
        maxAge: 1e3 * 60 * 60 * 24 * 30
        // 30 days
      }
    })
  );
  app2.use(passport.initialize());
  app2.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user.openId);
  });
  passport.deserializeUser(async (openId, done) => {
    try {
      const user = await getUserByOpenId(openId);
      done(null, user || null);
    } catch (err) {
      done(err, null);
    }
  });
  if (ENV.googleClientId && ENV.googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: ENV.googleClientId,
          clientSecret: ENV.googleClientSecret,
          // callbackURL is built dynamically per-request (see below)
          callbackURL: "/api/auth/google/callback",
          passReqToCallback: true
        },
        async (req, accessToken, refreshToken, profile, done) => {
          try {
            const email = profile.emails?.[0]?.value ?? null;
            const googleId = `google_${profile.id}`;
            const name = profile.displayName || profile.name?.givenName || null;
            const isAdmin = email && ADMIN_EMAILS.has(email.toLowerCase());
            await upsertUser({
              openId: googleId,
              name,
              email,
              loginMethod: "google",
              lastSignedIn: /* @__PURE__ */ new Date()
            });
            if (isAdmin) {
              const existingUser = await getUserByOpenId(googleId);
              if (existingUser && existingUser.role !== "admin") {
                await promoteToAdmin(googleId);
              }
            }
            const user = await getUserByOpenId(googleId);
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );
    app2.get("/api/auth/google", (req, res, next) => {
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const callbackURL = `${protocol}://${host}/api/auth/google/callback`;
      passport.authenticate("google", {
        scope: ["profile", "email"],
        callbackURL
      })(req, res, next);
    });
    app2.get(
      "/api/auth/google/callback",
      (req, res, next) => {
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        const callbackURL = `${protocol}://${host}/api/auth/google/callback`;
        passport.authenticate("google", {
          failureRedirect: "/?auth=failed",
          callbackURL
        })(req, res, next);
      },
      (req, res) => {
        const user = req.user;
        if (user?.role === "admin") {
          res.redirect("/admin");
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    console.warn("[OAuth] Google OAuth credentials not configured \u2014 auth disabled.");
  }
  app2.get("/api/oauth/callback", (req, res) => {
    res.redirect("/api/auth/google");
  });
}
function getSessionUser(req) {
  return req.user ?? null;
}

// server/_core/storageProxy.ts
function registerStorageProxy(app2) {
  app2.get("/manus-storage/*", async (req, res) => {
    const key = req.params[0];
    if (!key) {
      res.status(400).send("Missing storage key");
      return;
    }
    if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
      res.status(500).send("Storage proxy not configured");
      return;
    }
    try {
      const forgeUrl = new URL(
        "v1/storage/presign/get",
        ENV.forgeApiUrl.replace(/\/+$/, "") + "/"
      );
      forgeUrl.searchParams.set("path", key);
      const forgeResp = await fetch(forgeUrl, {
        headers: { Authorization: `Bearer ${ENV.forgeApiKey}` }
      });
      if (!forgeResp.ok) {
        const body = await forgeResp.text().catch(() => "");
        console.error(`[StorageProxy] forge error: ${forgeResp.status} ${body}`);
        res.status(502).send("Storage backend error");
        return;
      }
      const { url } = await forgeResp.json();
      if (!url) {
        res.status(502).send("Empty signed URL from backend");
        return;
      }
      res.set("Cache-Control", "no-store");
      res.redirect(307, url);
    } catch (err) {
      console.error("[StorageProxy] failed:", err);
      res.status(502).send("Storage proxy error");
    }
  });
}

// server/_core/systemRouter.ts
import { z } from "zod";

// server/_core/notification.ts
import { TRPCError } from "@trpc/server";
var TITLE_MAX_LENGTH = 1200;
var CONTENT_MAX_LENGTH = 2e4;
var trimValue = (value) => value.trim();
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var buildEndpointUrl = (baseUrl) => {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  return new URL(
    "webdevtoken.v1.WebDevService/SendNotification",
    normalizedBase
  ).toString();
};
var validatePayload = (input) => {
  if (!isNonEmptyString(input.title)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification title is required."
    });
  }
  if (!isNonEmptyString(input.content)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Notification content is required."
    });
  }
  const title = trimValue(input.title);
  const content = trimValue(input.content);
  if (title.length > TITLE_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification title must be at most ${TITLE_MAX_LENGTH} characters.`
    });
  }
  if (content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: `Notification content must be at most ${CONTENT_MAX_LENGTH} characters.`
    });
  }
  return { title, content };
};
async function notifyOwner(payload) {
  const { title, content } = validatePayload(payload);
  if (!ENV.forgeApiUrl) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service URL is not configured."
    });
  }
  if (!ENV.forgeApiKey) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Notification service API key is not configured."
    });
  }
  const endpoint = buildEndpointUrl(ENV.forgeApiUrl);
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        accept: "application/json",
        authorization: `Bearer ${ENV.forgeApiKey}`,
        "content-type": "application/json",
        "connect-protocol-version": "1"
      },
      body: JSON.stringify({ title, content })
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.warn(
        `[Notification] Failed to notify owner (${response.status} ${response.statusText})${detail ? `: ${detail}` : ""}`
      );
      return false;
    }
    return true;
  } catch (error) {
    console.warn("[Notification] Error calling notification service:", error);
    return false;
  }
}

// shared/const.ts
var COOKIE_NAME = "app_session_id";
var ONE_YEAR_MS = 1e3 * 60 * 60 * 24 * 365;
var AXIOS_TIMEOUT_MS = 3e4;
var UNAUTHED_ERR_MSG = "Please login (10001)";
var NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

// server/_core/trpc.ts
import { initTRPC, TRPCError as TRPCError2 } from "@trpc/server";
import superjson from "superjson";
var t = initTRPC.context().create({
  transformer: superjson
});
var router = t.router;
var publicProcedure = t.procedure;
var requireUser = t.middleware(async (opts) => {
  const { ctx, next } = opts;
  if (!ctx.user) {
    throw new TRPCError2({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }
  return next({
    ctx: {
      ...ctx,
      user: ctx.user
    }
  });
});
var protectedProcedure = t.procedure.use(requireUser);
var adminProcedure = t.procedure.use(
  t.middleware(async (opts) => {
    const { ctx, next } = opts;
    if (!ctx.user || ctx.user.role !== "admin") {
      throw new TRPCError2({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }
    return next({
      ctx: {
        ...ctx,
        user: ctx.user
      }
    });
  })
);

// server/_core/systemRouter.ts
var systemRouter = router({
  health: publicProcedure.input(
    z.object({
      timestamp: z.number().min(0, "timestamp cannot be negative")
    })
  ).query(() => ({
    ok: true
  })),
  notifyOwner: adminProcedure.input(
    z.object({
      title: z.string().min(1, "title is required"),
      content: z.string().min(1, "content is required")
    })
  ).mutation(async ({ input }) => {
    const delivered = await notifyOwner(input);
    return {
      success: delivered
    };
  })
});

// server/routers/intake.ts
import { z as z3 } from "zod";
import { nanoid } from "nanoid";
import { TRPCError as TRPCError3 } from "@trpc/server";

// server/_core/email.ts
import nodemailer from "nodemailer";
var SMTP_HOST = "smtp.gmail.com";
var SMTP_PORT = 465;
var DEFAULT_FROM = `"rEBOOtBlood Notifications" <${ENV.smtpUser || "care@rebootblood.clinic"}>`;
var DEFAULT_TO = ENV.smtpUser || "care@rebootblood.clinic";
var transporter = null;
function getTransporter() {
  if (!ENV.smtpUser || !ENV.smtpAppPassword) {
    console.warn("[Email] SMTP credentials not configured \u2014 email delivery disabled.");
    return null;
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: true,
      // SSL
      auth: {
        user: ENV.smtpUser,
        pass: ENV.smtpAppPassword
      }
    });
  }
  return transporter;
}
async function sendEmail(options) {
  const t2 = getTransporter();
  if (!t2) return false;
  try {
    await t2.sendMail({
      from: DEFAULT_FROM,
      to: options.to || DEFAULT_TO,
      subject: options.subject,
      text: options.text,
      html: options.html
    });
    return true;
  } catch (err) {
    console.error("[Email] Failed to send:", err);
    return false;
  }
}
function formatLeadEmail(lead) {
  const lines = [
    `New lead submission received.`,
    ``,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    lead.phone ? `Phone: ${lead.phone}` : null,
    lead.interest ? `Interest: ${lead.interest}` : null,
    lead.selectedTier ? `Selected tier: ${lead.selectedTier}` : null,
    lead.source ? `Source: ${lead.source}` : null,
    lead.message ? `
Message:
${lead.message}` : null,
    ``,
    `---`,
    `View full details in the admin dashboard.`
  ].filter(Boolean);
  return {
    subject: `[rEBOOtBlood] New Lead: ${lead.name} \u2014 ${lead.interest || "General inquiry"}`,
    text: lines.join("\n")
  };
}
function formatQuestionnaireEmail(submission) {
  const lines = [
    `New eligibility questionnaire submitted.`,
    ``,
    `Name: ${submission.name}`,
    `Email: ${submission.email}`,
    submission.phone ? `Phone: ${submission.phone}` : null,
    submission.preferredContact ? `Preferred contact: ${submission.preferredContact}` : null,
    submission.interest ? `Interest: ${submission.interest}` : null,
    submission.volume ? `EBO3 volume: ${submission.volume}` : null,
    submission.selectedTier ? `Selected tier: ${submission.selectedTier}` : null,
    submission.location ? `Location: ${submission.location}` : null,
    submission.goals ? `Goals: ${submission.goals}` : null,
    ``,
    `NOTE: Health-screening answers are stored securely in the admin dashboard (encrypted at rest). They are NOT included in this email for HIPAA compliance.`,
    ``,
    `---`,
    `View full submission in the admin dashboard.`
  ].filter(Boolean);
  return {
    subject: `[rEBOOtBlood] New Questionnaire: ${submission.name} \u2014 ${submission.interest || "Eligibility"}`,
    text: lines.join("\n")
  };
}

// server/_core/phi.ts
import crypto from "node:crypto";
var ALGO = "aes-256-gcm";
var IV_LENGTH = 12;
var warnedFallback = false;
function resolveKey() {
  const raw = ENV.phiEncryptionKey?.trim();
  if (raw && /^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  if (!warnedFallback) {
    console.warn(
      "[PHI] PHI_ENCRYPTION_KEY missing or not a 64-char hex string. Falling back to a key derived from JWT_SECRET. Do NOT use this for real PHI in production."
    );
    warnedFallback = true;
  }
  const seed = ENV.cookieSecret || "rebootblood-dev-seed";
  return crypto.createHash("sha256").update(seed).digest();
}
function encryptString(plaintext) {
  const key = resolveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(".");
}
function decryptString(token) {
  const key = resolveKey();
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format");
  }
  const [ivB64, tagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}
function encryptJson(value) {
  return encryptString(JSON.stringify(value));
}
function decryptJson(token) {
  return JSON.parse(decryptString(token));
}
function hashForAudit(input) {
  if (!input) return null;
  return crypto.createHash("sha256").update(`${ENV.cookieSecret || "salt"}:${input}`).digest("hex").slice(0, 32);
}

// server/_core/audit.ts
async function recordAudit(ctx, params) {
  try {
    const xff = ctx.req?.headers?.["x-forwarded-for"] ?? "";
    const rawIp = xff.split(",")[0]?.trim() || ctx.req?.socket?.remoteAddress || "";
    const userAgent = ctx.req?.headers?.["user-agent"] ?? null;
    await insertAuditLog({
      actorUserId: ctx.user?.id ?? null,
      actorOpenId: ctx.user?.openId ?? null,
      actorName: ctx.user?.name ?? ctx.user?.email ?? null,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId ?? null,
      detail: params.detail ?? null,
      ipHash: hashForAudit(rawIp),
      userAgent
    });
  } catch (err) {
    console.error("[Audit] Failed to record audit event:", params.action, err);
  }
}
function requestIpHash(ctx) {
  const xff = ctx.req?.headers?.["x-forwarded-for"] ?? "";
  const rawIp = xff.split(",")[0]?.trim() || ctx.req?.socket?.remoteAddress || "";
  return hashForAudit(rawIp);
}

// shared/forms.ts
import { z as z2 } from "zod";
var treatmentInterestEnum = z2.enum(["eboo", "plasmapheresis", "both", "unsure"]);
var ebo3VolumeEnum = z2.enum(["3L", "4.5L", "6L"]);
var workflowStatusEnum = z2.enum(["new", "reviewing", "contacted", "scheduled", "closed"]);
var questionnaireSchema = z2.object({
  // Step 1 — health history
  age: z2.coerce.number().int().min(18, "Patients must be 18 or older").max(120),
  biologicalSex: z2.enum(["female", "male", "intersex", "prefer_not"]).optional(),
  knownG6PDDeficiency: z2.enum(["yes", "no", "unsure"]),
  pregnantOrNursing: z2.enum(["yes", "no", "na"]),
  bleedingOrClottingDisorder: z2.enum(["yes", "no", "unsure"]),
  recentCardiacOrStrokeEvent: z2.enum(["yes", "no", "unsure"]),
  currentMedications: z2.string().max(2e3).optional().default(""),
  // Step 2 — conditions
  conditions: z2.array(z2.string()).default([]),
  conditionsOther: z2.string().max(1e3).optional().default(""),
  // Step 3 — symptoms
  symptoms: z2.array(z2.string()).default([]),
  symptomDuration: z2.enum(["lt1m", "1to6m", "6to12m", "gt12m", "na"]).optional(),
  // Step 4 — goals
  goals: z2.array(z2.string()).default([]),
  treatmentInterest: treatmentInterestEnum,
  ebo3Volume: z2.enum(["3L", "4.5L", "6L"]).optional(),
  additionalNotes: z2.string().max(2e3).optional().default(""),
  // Step 5 — contact
  firstName: z2.string().min(1, "First name is required").max(100),
  lastName: z2.string().min(1, "Last name is required").max(100),
  email: z2.string().email("A valid email is required").max(320),
  phone: z2.string().min(7, "A valid phone number is required").max(40),
  preferredContact: z2.enum(["email", "phone", "either"]).default("either"),
  city: z2.string().max(120).optional().default(""),
  state: z2.string().max(120).optional().default(""),
  // Consent — explicit, separate booleans (never bundled into submit)
  consentTreatmentInfo: z2.literal(true, {
    message: "You must acknowledge the educational/treatment information notice."
  }),
  consentPrivacy: z2.literal(true, {
    message: "You must agree to the Privacy Policy to submit health information."
  }),
  consentContact: z2.literal(true, {
    message: "You must consent to be contacted about your inquiry."
  })
});
var leadSchema = z2.object({
  name: z2.string().min(1, "Name is required").max(160),
  email: z2.string().email("A valid email is required").max(320),
  phone: z2.string().max(40).optional().default(""),
  treatmentInterest: treatmentInterestEnum.default("unsure"),
  message: z2.string().max(2e3).optional().default(""),
  source: z2.string().max(64).optional().default("lead_form"),
  /** Pricing tier the lead clicked "Book this tier" from (optional, non-PHI). */
  selectedTier: z2.string().max(120).optional().default(""),
  consentContact: z2.literal(true, {
    message: "You must consent to be contacted."
  })
});
var TREATMENT_INTEREST_LABELS = {
  eboo: "EBO3 / EBOO",
  plasmapheresis: "Plasmapheresis",
  both: "Both treatments",
  unsure: "Not sure yet"
};

// shared/notificationBody.ts
var PREFERRED_CONTACT_LABELS = {
  email: "Email",
  phone: "Phone",
  either: "Either"
};
function line(label, value) {
  if (value === null || value === void 0) return null;
  const v = String(value).trim();
  if (!v) return null;
  return `${label}: ${v}`;
}
function formatLeadNotification(args) {
  const { publicId, payload, source, selectedTier } = args;
  const lines = [
    "A new lead was submitted via the website.",
    "",
    line("Reference", publicId),
    line("Name", payload.name),
    line("Email", payload.email),
    line("Phone", payload.phone),
    line("Treatment interest", TREATMENT_INTEREST_LABELS[payload.treatmentInterest]),
    line("Selected tier", selectedTier),
    line("Source", source),
    line("Message", payload.message),
    "",
    "Manage and update status in the secure admin dashboard."
  ];
  return lines.filter((l) => l !== null).join("\n");
}
function formatQuestionnaireNotification(args) {
  const { publicId, payload } = args;
  const fullName = [payload.firstName, payload.lastName].filter(Boolean).join(" ");
  const location = [payload.city, payload.state].filter(Boolean).join(", ");
  const preferred = payload.preferredContact ? PREFERRED_CONTACT_LABELS[payload.preferredContact] ?? payload.preferredContact : "";
  const goals = Array.isArray(payload.goals) ? payload.goals.filter(Boolean).join("; ") : "";
  const lines = [
    "A new eligibility questionnaire was submitted via the website.",
    "",
    line("Reference", publicId),
    line("Name", fullName),
    line("Email", payload.email),
    line("Phone", payload.phone),
    line("Preferred contact", preferred),
    line("Location", location),
    line("Age", payload.age),
    line("Treatment interest", TREATMENT_INTEREST_LABELS[payload.treatmentInterest]),
    line("EBO3 volume", payload.ebo3Volume),
    line("Goals", goals),
    "",
    "Health screening answers are not included here for privacy. View the full,",
    "encrypted submission in the secure admin dashboard."
  ];
  return lines.filter((l) => l !== null).join("\n");
}

// server/routers/intake.ts
var listFilterSchema = z3.object({
  status: workflowStatusEnum.optional(),
  treatmentInterest: treatmentInterestEnum.optional(),
  sourceGroup: z3.enum(["patient", "partner"]).optional()
});
var intakeRouter = router({
  /** Patient eligibility questionnaire submission (public). */
  submitQuestionnaire: publicProcedure.input(questionnaireSchema).mutation(async ({ input, ctx }) => {
    const publicId = `Q-${nanoid(12)}`;
    const payload = {
      ...input,
      consentTreatmentInfo: true,
      consentPrivacy: true,
      consentContact: true,
      submittedAt: Date.now()
    };
    await insertQuestionnaireSubmission({
      publicId,
      encryptedPayload: encryptJson(payload),
      treatmentInterest: input.treatmentInterest,
      consentTreatmentInfo: input.consentTreatmentInfo,
      consentPrivacy: input.consentPrivacy,
      consentContact: input.consentContact,
      submittedIpHash: requestIpHash(ctx)
    });
    await recordAudit(ctx, {
      action: "questionnaire.create",
      targetType: "questionnaire",
      targetId: publicId,
      detail: `interest=${input.treatmentInterest}`
    });
    void notifyOwner({
      title: `New eligibility submission \u2014 ${[payload.firstName, payload.lastName].filter(Boolean).join(" ") || "patient"}`,
      content: formatQuestionnaireNotification({ publicId, payload })
    }).catch(() => void 0);
    void sendEmail(
      formatQuestionnaireEmail({
        name: [payload.firstName, payload.lastName].filter(Boolean).join(" "),
        email: payload.email,
        phone: payload.phone,
        preferredContact: payload.preferredContact,
        interest: input.treatmentInterest,
        volume: payload.ebo3Volume ?? void 0,
        selectedTier: payload.selectedTier ?? void 0,
        location: [payload.city, payload.state].filter(Boolean).join(", "),
        goals: payload.goals?.join(", ")
      })
    ).catch(() => void 0);
    return { success: true, reference: publicId };
  }),
  /**
   * Record a lightweight tier-CTA conversion event (public, fire-and-forget).
   * No PII is captured — only the tier label, interest, action kind, and path.
   */
  recordTierEvent: publicProcedure.input(
    z3.object({
      tier: z3.string().trim().min(1).max(120),
      treatmentInterest: treatmentInterestEnum.default("unsure"),
      action: z3.enum(["book", "check_eligibility"]),
      sourcePath: z3.string().max(200).optional()
    })
  ).mutation(async ({ input }) => {
    await insertTierEvent({
      tier: input.tier,
      treatmentInterest: input.treatmentInterest,
      action: input.action,
      sourcePath: input.sourcePath ?? null
    });
    return { success: true };
  }),
  /** Lead-capture form (public). Owner notification fires on EVERY submission. */
  submitLead: publicProcedure.input(leadSchema).mutation(async ({ input, ctx }) => {
    const publicId = `L-${nanoid(12)}`;
    const payload = {
      ...input,
      consentContact: true,
      submittedAt: Date.now()
    };
    const selectedTier = (input.selectedTier || "").trim();
    await insertLead({
      publicId,
      encryptedPayload: encryptJson(payload),
      source: input.source || "lead_form",
      treatmentInterest: input.treatmentInterest,
      selectedTier: selectedTier || null,
      consentContact: input.consentContact,
      submittedIpHash: requestIpHash(ctx)
    });
    await recordAudit(ctx, {
      action: "lead.create",
      targetType: "lead",
      targetId: publicId,
      detail: `source=${input.source || "lead_form"}`
    });
    const delivered = await notifyOwner({
      title: `New lead \u2014 ${payload.name || "website"}${selectedTier ? ` (${selectedTier})` : ""}`,
      content: formatLeadNotification({
        publicId,
        payload,
        source: input.source || "lead_form",
        selectedTier: selectedTier || null
      })
    }).catch(() => false);
    void sendEmail(
      formatLeadEmail({
        name: payload.name,
        email: payload.email,
        phone: payload.phone ?? void 0,
        interest: input.treatmentInterest,
        source: input.source || "lead_form",
        selectedTier: selectedTier || void 0,
        message: payload.message ?? void 0
      })
    ).catch(() => void 0);
    return { success: true, reference: publicId, notified: !!delivered };
  })
});
var adminRouter = router({
  dashboardCounts: adminProcedure.query(async () => {
    return getDashboardCounts();
  }),
  listSubmissions: adminProcedure.input(listFilterSchema).query(async ({ input, ctx }) => {
    const rows = await listQuestionnaireSubmissions(input);
    await recordAudit(ctx, {
      action: "questionnaire.list",
      targetType: "questionnaire",
      detail: `count=${rows.length}${input.status ? ` status=${input.status}` : ""}`
    });
    return rows.map((r) => ({
      publicId: r.publicId,
      treatmentInterest: r.treatmentInterest,
      status: r.status,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  }),
  getSubmission: adminProcedure.input(z3.object({ publicId: z3.string().min(1) })).query(async ({ input, ctx }) => {
    const row = await getQuestionnaireSubmissionByPublicId(input.publicId);
    if (!row) throw new TRPCError3({ code: "NOT_FOUND" });
    await recordAudit(ctx, {
      action: "questionnaire.view",
      targetType: "questionnaire",
      targetId: row.publicId
    });
    const payload = decryptJson(row.encryptedPayload);
    return {
      publicId: row.publicId,
      treatmentInterest: row.treatmentInterest,
      status: row.status,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      payload
    };
  }),
  setSubmissionStatus: adminProcedure.input(z3.object({ publicId: z3.string().min(1), status: workflowStatusEnum })).mutation(async ({ input, ctx }) => {
    await updateQuestionnaireStatus(input.publicId, input.status);
    await recordAudit(ctx, {
      action: "questionnaire.status",
      targetType: "questionnaire",
      targetId: input.publicId,
      detail: `status=${input.status}`
    });
    return { success: true };
  }),
  listLeads: adminProcedure.input(listFilterSchema).query(async ({ input, ctx }) => {
    const rows = await listLeads(input);
    await recordAudit(ctx, {
      action: "lead.list",
      targetType: "lead",
      detail: `count=${rows.length}`
    });
    return rows.map((r) => ({
      publicId: r.publicId,
      treatmentInterest: r.treatmentInterest,
      status: r.status,
      source: r.source,
      selectedTier: r.selectedTier ?? "",
      createdAt: r.createdAt,
      updatedAt: r.updatedAt
    }));
  }),
  getLead: adminProcedure.input(z3.object({ publicId: z3.string().min(1) })).query(async ({ input, ctx }) => {
    const row = await getLeadByPublicId(input.publicId);
    if (!row) throw new TRPCError3({ code: "NOT_FOUND" });
    await recordAudit(ctx, {
      action: "lead.view",
      targetType: "lead",
      targetId: row.publicId
    });
    const payload = decryptJson(row.encryptedPayload);
    return {
      publicId: row.publicId,
      treatmentInterest: row.treatmentInterest,
      status: row.status,
      source: row.source,
      selectedTier: row.selectedTier ?? "",
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      payload
    };
  }),
  setLeadStatus: adminProcedure.input(z3.object({ publicId: z3.string().min(1), status: workflowStatusEnum })).mutation(async ({ input, ctx }) => {
    await updateLeadStatus(input.publicId, input.status);
    await recordAudit(ctx, {
      action: "lead.status",
      targetType: "lead",
      targetId: input.publicId,
      detail: `status=${input.status}`
    });
    return { success: true };
  }),
  tierStats: adminProcedure.input(z3.object({ range: z3.enum(["7d", "30d", "90d", "all"]).default("all") }).optional()).query(async ({ input, ctx }) => {
    const range = input?.range ?? "all";
    const stats = await getTierEventStats(range);
    await recordAudit(ctx, {
      action: "tier.stats",
      targetType: "system",
      detail: `range=${range} tiers=${stats.length}`
    });
    return stats;
  }),
  listAuditLogs: adminProcedure.input(z3.object({ limit: z3.number().int().min(1).max(500).optional() })).query(async ({ input, ctx }) => {
    const rows = await listAuditLogs(input.limit ?? 200);
    await recordAudit(ctx, {
      action: "audit.list",
      targetType: "system",
      detail: `count=${rows.length}`
    });
    return rows;
  }),
  /** Audited CSV export. Decrypts PHI for the matching set — every export is logged. */
  exportSubmissions: adminProcedure.input(listFilterSchema).mutation(async ({ input, ctx }) => {
    const rows = await listQuestionnaireSubmissions(input);
    await recordAudit(ctx, {
      action: "questionnaire.export",
      targetType: "questionnaire",
      detail: `count=${rows.length}${input.status ? ` status=${input.status}` : ""}`
    });
    const records = rows.map((r) => {
      const p = decryptJson(r.encryptedPayload);
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
        submittedAt: new Date(p.submittedAt).toISOString()
      };
    });
    return { csv: toCsv(records), count: records.length };
  }),
  exportLeads: adminProcedure.input(listFilterSchema).mutation(async ({ input, ctx }) => {
    const rows = await listLeads(input);
    await recordAudit(ctx, {
      action: "lead.export",
      targetType: "lead",
      detail: `count=${rows.length}`
    });
    const records = rows.map((r) => {
      const p = decryptJson(r.encryptedPayload);
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
        submittedAt: new Date(p.submittedAt).toISOString()
      };
    });
    return { csv: toCsv(records), count: records.length };
  })
});
function toCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const escape = (v) => {
    const s = v ?? "";
    return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(",")];
  for (const row of rows) lines.push(headers.map((h) => escape(row[h])).join(","));
  return lines.join("\r\n");
}

// server/routers/content.ts
import { z as z4 } from "zod";
import { TRPCError as TRPCError4 } from "@trpc/server";

// server/_core/linkartemis.ts
import sanitizeHtml from "sanitize-html";

// shared/learnSlugs.ts
var RESERVED_LEARN_SLUGS = [
  "blood-oil-change",
  "ebo2-vs-eboo",
  "ebo3-eboo-blood-therapy",
  "eboo-comparison-guide",
  "eboo-for-autoimmune",
  "eboo-for-cardiovascular",
  "eboo-for-chronic-fatigue",
  "eboo-for-long-covid",
  "eboo-for-longevity",
  "eboo-for-lyme-disease",
  "eboo-for-mold-and-toxins",
  "plasmapheresis-tpe",
  "uvbi-ultraviolet-blood-irradiation",
  "what-is-eboo-therapy"
];
var RESERVED_LEARN_SLUG_SET = new Set(RESERVED_LEARN_SLUGS);

// server/_core/linkartemis.ts
function sanitizeArticleHtml(rawHtml) {
  return sanitizeHtml(rawHtml ?? "", {
    allowedTags: [
      "p",
      "br",
      "hr",
      "h2",
      "h3",
      "h4",
      "ul",
      "ol",
      "li",
      "blockquote",
      "strong",
      "em",
      "b",
      "i",
      "u",
      "s",
      "code",
      "pre",
      "a",
      "img",
      "figure",
      "figcaption",
      "table",
      "thead",
      "tbody",
      "tr",
      "th",
      "td"
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "loading"],
      "*": ["id"]
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Force external links to open safely; drop javascript: etc. via schemes above.
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const isAnchor = href.startsWith("#");
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            ...isAnchor ? {} : { target: "_blank", rel: "noopener noreferrer nofollow" }
          }
        };
      },
      img: (tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: "lazy" }
      })
    }
    // Disallow inline event handlers / styles implicitly (not in allowedAttributes).
  }).trim();
}
function parseRemoteDate(iso) {
  if (!iso) return null;
  const t2 = Date.parse(iso);
  return Number.isNaN(t2) ? null : new Date(t2);
}
function namespaceSlug(rawSlug, reservedSlugs) {
  const base = (rawSlug || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "");
  if (!base) return "";
  return reservedSlugs.has(base) ? `la-${base}` : base;
}
function mapRemoteArticle(detail, reservedSlugs = RESERVED_LEARN_SLUG_SET) {
  const contentHtml = sanitizeArticleHtml(detail.content_html ?? "");
  const slug = namespaceSlug(detail.slug ?? "", reservedSlugs);
  if (!detail.id || !slug || !contentHtml) return null;
  return {
    source: "linkartemis",
    remoteId: detail.id,
    slug,
    title: detail.title ?? "Untitled",
    excerpt: detail.excerpt ?? null,
    metaDescription: detail.meta_description ?? detail.excerpt ?? null,
    heroImageUrl: detail.hero_image_url ?? null,
    keywords: JSON.stringify(Array.isArray(detail.keywords) ? detail.keywords : []),
    languageCode: detail.language_code ?? null,
    contentHtml,
    remoteCreatedAt: parseRemoteDate(detail.created_at),
    lastSyncedAt: /* @__PURE__ */ new Date()
  };
}
function authHeaders(apiKey) {
  return { "X-API-Key": apiKey, Accept: "application/json" };
}
async function fetchArticleList(opts = {}) {
  const apiKey = opts.apiKey ?? ENV.linkArtemisApiKey;
  const baseUrl = opts.baseUrl ?? ENV.linkArtemisApiUrl;
  if (!apiKey) throw new Error("LINKARTEMIS_API_KEY is not configured");
  const res = await fetch(`${baseUrl}/articles`, {
    headers: authHeaders(apiKey),
    signal: opts.signal
  });
  if (!res.ok) {
    throw new Error(`LinkArtemis list failed: HTTP ${res.status}`);
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
async function fetchArticleDetail(id, opts = {}) {
  const apiKey = opts.apiKey ?? ENV.linkArtemisApiKey;
  const baseUrl = opts.baseUrl ?? ENV.linkArtemisApiUrl;
  if (!apiKey) throw new Error("LINKARTEMIS_API_KEY is not configured");
  const res = await fetch(`${baseUrl}/articles/${encodeURIComponent(id)}`, {
    headers: authHeaders(apiKey),
    signal: opts.signal
  });
  if (!res.ok) {
    throw new Error(`LinkArtemis detail failed (${id}): HTTP ${res.status}`);
  }
  return await res.json();
}
async function syncLinkArtemis(upsert, opts = {}, deps = {}) {
  const list = deps.list ?? fetchArticleList;
  const detail = deps.detail ?? fetchArticleDetail;
  const summary = { fetched: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };
  const items = await list(opts);
  summary.fetched = items.length;
  for (const item of items) {
    try {
      const d = await detail(item.id, opts);
      const row = mapRemoteArticle(d);
      if (!row) {
        summary.skipped += 1;
        continue;
      }
      const result = await upsert(row);
      if (result === "inserted") summary.inserted += 1;
      else summary.updated += 1;
    } catch (err) {
      summary.errors.push(`${item.id}: ${err.message}`);
    }
  }
  return summary;
}

// server/routers/content.ts
var syncedStatusEnum = z4.enum(["pending", "published", "hidden"]);
function toDto(r) {
  if (!r) return r;
  let keywords = [];
  try {
    keywords = r.keywords ? JSON.parse(r.keywords) : [];
  } catch {
    keywords = [];
  }
  return {
    id: r.id,
    source: r.source,
    remoteId: r.remoteId,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    metaDescription: r.metaDescription ?? "",
    heroImageUrl: r.heroImageUrl ?? "",
    keywords,
    languageCode: r.languageCode ?? "",
    contentHtml: r.contentHtml,
    status: r.status,
    remoteCreatedAt: r.remoteCreatedAt,
    publishedAt: r.publishedAt,
    lastSyncedAt: r.lastSyncedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt
  };
}
var contentRouter = router({
  /* ------------------------------ Public reads ------------------------------ */
  /** Published synced articles for the Learning Center list (no body). */
  listPublished: publicProcedure.query(async () => {
    const rows = await listPublishedSyncedArticles();
    return rows.map((r) => {
      const dto = toDto(r);
      const { contentHtml: _omit, ...rest } = dto;
      return rest;
    });
  }),
  /** A single published synced article by slug (for /learn/:slug rendering). */
  getPublishedBySlug: publicProcedure.input(z4.object({ slug: z4.string().min(1) })).query(async ({ input }) => {
    const row = await getPublishedSyncedArticleBySlug(input.slug);
    if (!row) return null;
    return toDto(row);
  }),
  /* ------------------------- Admin: sync + review queue ------------------------- */
  /** Trigger a sync from LinkArtemis. New articles arrive as "pending". */
  runSync: adminProcedure.mutation(async ({ ctx }) => {
    const summary = await syncLinkArtemis(upsertSyncedArticle);
    await recordAudit(ctx, {
      action: "content.sync",
      targetType: "system",
      detail: `fetched=${summary.fetched} inserted=${summary.inserted} updated=${summary.updated} skipped=${summary.skipped} errors=${summary.errors.length}`
    });
    return summary;
  }),
  /** Admin list of synced articles (any status), optionally filtered. */
  listSynced: adminProcedure.input(z4.object({ status: syncedStatusEnum.optional() }).optional()).query(async ({ input, ctx }) => {
    const rows = await listSyncedArticles(input?.status);
    await recordAudit(ctx, {
      action: "content.list",
      targetType: "system",
      detail: `count=${rows.length}${input?.status ? ` status=${input.status}` : ""}`
    });
    return rows.map((r) => {
      const dto = toDto(r);
      const { contentHtml: _omit, ...rest } = dto;
      return rest;
    });
  }),
  /** Admin: full synced article (incl. body) for the review/preview drawer. */
  getSynced: adminProcedure.input(z4.object({ id: z4.number().int().positive() })).query(async ({ input, ctx }) => {
    const row = await getSyncedArticleById(input.id);
    if (!row) throw new TRPCError4({ code: "NOT_FOUND" });
    await recordAudit(ctx, {
      action: "content.view",
      targetType: "system",
      targetId: row.slug
    });
    return toDto(row);
  }),
  /** Admin: publish / hide / send back to pending. */
  setStatus: adminProcedure.input(z4.object({ id: z4.number().int().positive(), status: syncedStatusEnum })).mutation(async ({ input, ctx }) => {
    const row = await getSyncedArticleById(input.id);
    if (!row) throw new TRPCError4({ code: "NOT_FOUND" });
    await setSyncedArticleStatus(input.id, input.status);
    await recordAudit(ctx, {
      action: "content.status",
      targetType: "system",
      targetId: row.slug,
      detail: `status=${input.status}`
    });
    return { success: true };
  })
});

// server/routers/godaddy.ts
import { z as z5 } from "zod";
import { TRPCError as TRPCError5 } from "@trpc/server";

// server/_core/godaddy.ts
function buildGoDaddyAuthHeader(key, secret) {
  return `sso-key ${key}:${secret}`;
}
function hasGoDaddyCredentials(key = ENV.godaddyApiKey, secret = ENV.godaddyApiSecret) {
  return Boolean(key && secret);
}
var ALLOWED_RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"];
function validateDnsRecord(record) {
  if (!record.type || !ALLOWED_RECORD_TYPES.includes(record.type)) {
    return `Unsupported record type: ${record.type ?? "(none)"}`;
  }
  if (!record.name || !record.name.trim()) {
    return "Record name is required (use '@' for the root).";
  }
  if (!record.data || !record.data.trim()) {
    return "Record data/value is required.";
  }
  if (record.ttl != null && (record.ttl < 600 || record.ttl > 604800)) {
    return "TTL must be between 600 and 604800 seconds.";
  }
  if (record.type === "MX" && (record.priority == null || record.priority < 0)) {
    return "MX records require a non-negative priority.";
  }
  return null;
}
var GoDaddyError = class extends Error {
  status;
  constructor(message, status) {
    super(message);
    this.name = "GoDaddyError";
    this.status = status;
  }
};
async function gdFetch(path3, init = {}, { key = ENV.godaddyApiKey, secret = ENV.godaddyApiSecret, baseUrl = ENV.godaddyApiUrl } = {}) {
  if (!key || !secret) {
    throw new GoDaddyError("GoDaddy credentials are not configured.", 500);
  }
  const res = await fetch(`${baseUrl}${path3}`, {
    ...init,
    headers: {
      Authorization: buildGoDaddyAuthHeader(key, secret),
      Accept: "application/json",
      ...init.body ? { "Content-Type": "application/json" } : {},
      ...init.headers ?? {}
    }
  });
  const text2 = await res.text();
  if (!res.ok) {
    let msg = text2;
    try {
      const parsed = JSON.parse(text2);
      msg = parsed.message || parsed.code || text2;
    } catch {
    }
    throw new GoDaddyError(`GoDaddy API ${res.status}: ${msg}`, res.status);
  }
  if (!text2) return void 0;
  return JSON.parse(text2);
}
async function listDomains(limit = 100) {
  const raw = await gdFetch(`/v1/domains?limit=${limit}`);
  return raw.map((d) => ({
    domain: d.domain,
    status: d.status,
    expires: d.expires ?? null,
    createdAt: d.createdAt ?? null,
    renewAuto: Boolean(d.renewAuto),
    locked: Boolean(d.locked),
    privacy: Boolean(d.privacy),
    nameServers: d.nameServers ?? null
  }));
}
async function checkAvailability(domain) {
  const raw = await gdFetch(`/v1/domains/available?domain=${encodeURIComponent(domain)}`);
  return {
    domain: raw.domain,
    available: Boolean(raw.available),
    definitive: Boolean(raw.definitive),
    price: raw.price,
    currency: raw.currency,
    period: raw.period
  };
}
async function suggestDomains(query, limit = 10) {
  const raw = await gdFetch(
    `/v1/domains/suggest?query=${encodeURIComponent(query)}&limit=${limit}`
  );
  return (raw ?? []).map((x) => x.domain).filter(Boolean);
}
async function getRecords(domain) {
  return gdFetch(`/v1/domains/${encodeURIComponent(domain)}/records`);
}
async function replaceRecords(domain, type, name, records) {
  await gdFetch(
    `/v1/domains/${encodeURIComponent(domain)}/records/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
    { method: "PUT", body: JSON.stringify(records) }
  );
}
async function addRecords(domain, records) {
  await gdFetch(`/v1/domains/${encodeURIComponent(domain)}/records`, {
    method: "PATCH",
    body: JSON.stringify(records)
  });
}

// server/routers/godaddy.ts
var domainSchema = z5.string().trim().min(3).max(253).regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid domain name");
var recordTypeSchema = z5.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"]);
function wrap(err) {
  if (err instanceof GoDaddyError) {
    throw new TRPCError5({
      code: err.status === 401 || err.status === 403 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message: err.message
    });
  }
  throw new TRPCError5({ code: "INTERNAL_SERVER_ERROR", message: err?.message ?? "GoDaddy request failed" });
}
var godaddyRouter = router({
  /** Whether the integration is configured (no secrets leaked). */
  status: adminProcedure.query(() => ({ configured: hasGoDaddyCredentials() })),
  listDomains: adminProcedure.input(z5.object({ limit: z5.number().int().min(1).max(1e3).default(100) }).optional()).query(async ({ input }) => {
    try {
      return await listDomains(input?.limit ?? 100);
    } catch (err) {
      wrap(err);
    }
  }),
  checkAvailability: adminProcedure.input(z5.object({ domain: domainSchema })).query(async ({ input }) => {
    try {
      return await checkAvailability(input.domain);
    } catch (err) {
      wrap(err);
    }
  }),
  suggestDomains: adminProcedure.input(z5.object({ query: z5.string().trim().min(2).max(100), limit: z5.number().int().min(1).max(25).default(10) })).query(async ({ input }) => {
    try {
      return await suggestDomains(input.query, input.limit);
    } catch (err) {
      wrap(err);
    }
  }),
  getRecords: adminProcedure.input(z5.object({ domain: domainSchema })).query(async ({ input }) => {
    try {
      return await getRecords(input.domain);
    } catch (err) {
      wrap(err);
    }
  }),
  /** Replace the record set of a given type+name (e.g. point A '@' at a new IP). */
  replaceRecords: adminProcedure.input(
    z5.object({
      domain: domainSchema,
      type: recordTypeSchema,
      name: z5.string().trim().min(1),
      records: z5.array(
        z5.object({
          data: z5.string().trim().min(1),
          ttl: z5.number().int().min(600).max(604800).optional(),
          priority: z5.number().int().min(0).optional()
        })
      ).min(1)
    })
  ).mutation(async ({ input }) => {
    for (const r of input.records) {
      const err = validateDnsRecord({ type: input.type, name: input.name, ...r });
      if (err) throw new TRPCError5({ code: "BAD_REQUEST", message: err });
    }
    try {
      await replaceRecords(input.domain, input.type, input.name, input.records);
      return { success: true };
    } catch (err) {
      wrap(err);
    }
  }),
  addRecords: adminProcedure.input(
    z5.object({
      domain: domainSchema,
      records: z5.array(
        z5.object({
          type: recordTypeSchema,
          name: z5.string().trim().min(1),
          data: z5.string().trim().min(1),
          ttl: z5.number().int().min(600).max(604800).optional(),
          priority: z5.number().int().min(0).optional()
        })
      ).min(1)
    })
  ).mutation(async ({ input }) => {
    for (const r of input.records) {
      const err = validateDnsRecord(r);
      if (err) throw new TRPCError5({ code: "BAD_REQUEST", message: err });
    }
    try {
      await addRecords(input.domain, input.records);
      return { success: true };
    } catch (err) {
      wrap(err);
    }
  })
});

// server/routers.ts
var appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      if (ctx.req.logout) {
        ctx.req.logout(() => {
        });
      }
      if (ctx.req.session?.destroy) {
        ctx.req.session.destroy(() => {
        });
      }
      ctx.res.clearCookie("connect.sid");
      return {
        success: true
      };
    })
  }),
  intake: intakeRouter,
  admin: adminRouter,
  content: contentRouter,
  godaddy: godaddyRouter
});

// server/_core/context.ts
async function createContext(opts) {
  const user = getSessionUser(opts.req) ?? null;
  return {
    req: opts.req,
    res: opts.res,
    user
  };
}

// server/_core/vite.ts
import express from "express";
import fs2 from "fs";
import { nanoid as nanoid2 } from "nanoid";
import path2 from "path";
import { createServer as createViteServer } from "vite";

// vite.config.ts
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";
var PROJECT_ROOT = import.meta.dirname;
var LOG_DIR = path.join(PROJECT_ROOT, ".manus-logs");
var MAX_LOG_SIZE_BYTES = 1 * 1024 * 1024;
var TRIM_TARGET_BYTES = Math.floor(MAX_LOG_SIZE_BYTES * 0.6);
function ensureLogDir() {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
}
function trimLogFile(logPath, maxSize) {
  try {
    if (!fs.existsSync(logPath) || fs.statSync(logPath).size <= maxSize) {
      return;
    }
    const lines = fs.readFileSync(logPath, "utf-8").split("\n");
    const keptLines = [];
    let keptBytes = 0;
    const targetSize = TRIM_TARGET_BYTES;
    for (let i = lines.length - 1; i >= 0; i--) {
      const lineBytes = Buffer.byteLength(`${lines[i]}
`, "utf-8");
      if (keptBytes + lineBytes > targetSize) break;
      keptLines.unshift(lines[i]);
      keptBytes += lineBytes;
    }
    fs.writeFileSync(logPath, keptLines.join("\n"), "utf-8");
  } catch {
  }
}
function writeToLogFile(source, entries) {
  if (entries.length === 0) return;
  ensureLogDir();
  const logPath = path.join(LOG_DIR, `${source}.log`);
  const lines = entries.map((entry) => {
    const ts = (/* @__PURE__ */ new Date()).toISOString();
    return `[${ts}] ${JSON.stringify(entry)}`;
  });
  fs.appendFileSync(logPath, `${lines.join("\n")}
`, "utf-8");
  trimLogFile(logPath, MAX_LOG_SIZE_BYTES);
}
function vitePluginManusDebugCollector() {
  return {
    name: "manus-debug-collector",
    transformIndexHtml(html) {
      if (process.env.NODE_ENV === "production") {
        return html;
      }
      return {
        html,
        tags: [
          {
            tag: "script",
            attrs: {
              src: "/__manus__/debug-collector.js",
              defer: true
            },
            injectTo: "head"
          }
        ]
      };
    },
    configureServer(server) {
      server.middlewares.use("/__manus__/logs", (req, res, next) => {
        if (req.method !== "POST") {
          return next();
        }
        const handlePayload = (payload) => {
          if (payload.consoleLogs?.length > 0) {
            writeToLogFile("browserConsole", payload.consoleLogs);
          }
          if (payload.networkRequests?.length > 0) {
            writeToLogFile("networkRequests", payload.networkRequests);
          }
          if (payload.sessionEvents?.length > 0) {
            writeToLogFile("sessionReplay", payload.sessionEvents);
          }
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ success: true }));
        };
        const reqBody = req.body;
        if (reqBody && typeof reqBody === "object") {
          try {
            handlePayload(reqBody);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
          return;
        }
        let body = "";
        req.on("data", (chunk) => {
          body += chunk.toString();
        });
        req.on("end", () => {
          try {
            const payload = JSON.parse(body);
            handlePayload(payload);
          } catch (e) {
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ success: false, error: String(e) }));
          }
        });
      });
    }
  };
}
var plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime(), vitePluginManusDebugCollector()];
var vite_config_default = defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1"
    ],
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/_core/vite.ts
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );
      let template = await fs2.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid2()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = process.env.NODE_ENV === "development" ? path2.resolve(import.meta.dirname, "../..", "dist", "public") : path2.resolve(import.meta.dirname, "public");
  if (!fs2.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// shared/_core/errors.ts
var HttpError = class extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
    this.name = "HttpError";
  }
};
var ForbiddenError = (msg) => new HttpError(403, msg);

// server/_core/sdk.ts
import axios from "axios";
import { parse as parseCookieHeader } from "cookie";
import { SignJWT, jwtVerify } from "jose";
var isNonEmptyString2 = (value) => typeof value === "string" && value.length > 0;
var EXCHANGE_TOKEN_PATH = `/webdev.v1.WebDevAuthPublicService/ExchangeToken`;
var GET_USER_INFO_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfo`;
var GET_USER_INFO_WITH_JWT_PATH = `/webdev.v1.WebDevAuthPublicService/GetUserInfoWithJwt`;
var OAuthService = class {
  constructor(client) {
    this.client = client;
    console.log("[OAuth] Initialized with baseURL:", ENV.oAuthServerUrl);
    if (!ENV.oAuthServerUrl) {
      console.error(
        "[OAuth] ERROR: OAUTH_SERVER_URL is not configured! Set OAUTH_SERVER_URL environment variable."
      );
    }
  }
  decodeState(state) {
    const redirectUri = atob(state);
    return redirectUri;
  }
  async getTokenByCode(code, state) {
    const payload = {
      clientId: ENV.appId,
      grantType: "authorization_code",
      code,
      redirectUri: this.decodeState(state)
    };
    const { data } = await this.client.post(
      EXCHANGE_TOKEN_PATH,
      payload
    );
    return data;
  }
  async getUserInfoByToken(token) {
    const { data } = await this.client.post(
      GET_USER_INFO_PATH,
      {
        accessToken: token.accessToken
      }
    );
    return data;
  }
};
var createOAuthHttpClient = () => axios.create({
  baseURL: ENV.oAuthServerUrl,
  timeout: AXIOS_TIMEOUT_MS
});
var SDKServer = class {
  client;
  oauthService;
  constructor(client = createOAuthHttpClient()) {
    this.client = client;
    this.oauthService = new OAuthService(this.client);
  }
  deriveLoginMethod(platforms, fallback) {
    if (fallback && fallback.length > 0) return fallback;
    if (!Array.isArray(platforms) || platforms.length === 0) return null;
    const set = new Set(
      platforms.filter((p) => typeof p === "string")
    );
    if (set.has("REGISTERED_PLATFORM_EMAIL")) return "email";
    if (set.has("REGISTERED_PLATFORM_GOOGLE")) return "google";
    if (set.has("REGISTERED_PLATFORM_APPLE")) return "apple";
    if (set.has("REGISTERED_PLATFORM_MICROSOFT") || set.has("REGISTERED_PLATFORM_AZURE"))
      return "microsoft";
    if (set.has("REGISTERED_PLATFORM_GITHUB")) return "github";
    const first = Array.from(set)[0];
    return first ? first.toLowerCase() : null;
  }
  /**
   * Exchange OAuth authorization code for access token
   * @example
   * const tokenResponse = await sdk.exchangeCodeForToken(code, state);
   */
  async exchangeCodeForToken(code, state) {
    return this.oauthService.getTokenByCode(code, state);
  }
  /**
   * Get user information using access token
   * @example
   * const userInfo = await sdk.getUserInfo(tokenResponse.accessToken);
   */
  async getUserInfo(accessToken) {
    const data = await this.oauthService.getUserInfoByToken({
      accessToken
    });
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  parseCookies(cookieHeader) {
    if (!cookieHeader) {
      return /* @__PURE__ */ new Map();
    }
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }
  getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }
  /**
   * Create a session token for a Manus user openId
   * @example
   * const sessionToken = await sdk.createSessionToken(userInfo.openId);
   */
  async createSessionToken(openId, options = {}) {
    return this.signSession(
      {
        openId,
        appId: ENV.appId,
        name: options.name || ""
      },
      options
    );
  }
  async signSession(payload, options = {}) {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1e3);
    const secretKey = this.getSessionSecret();
    return new SignJWT({
      openId: payload.openId,
      appId: payload.appId,
      name: payload.name
    }).setProtectedHeader({ alg: "HS256", typ: "JWT" }).setExpirationTime(expirationSeconds).sign(secretKey);
  }
  async verifySession(cookieValue) {
    if (!cookieValue) {
      console.warn("[Auth] Missing session cookie");
      return null;
    }
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"]
      });
      const { openId, appId, name } = payload;
      if (!isNonEmptyString2(openId) || !isNonEmptyString2(appId) || !isNonEmptyString2(name)) {
        console.warn("[Auth] Session payload missing required fields");
        return null;
      }
      return {
        openId,
        appId,
        name
      };
    } catch (error) {
      console.warn("[Auth] Session verification failed", String(error));
      return null;
    }
  }
  async getUserInfoWithJwt(jwtToken) {
    const payload = {
      jwtToken,
      projectId: ENV.appId
    };
    const { data } = await this.client.post(
      GET_USER_INFO_WITH_JWT_PATH,
      payload
    );
    const loginMethod = this.deriveLoginMethod(
      data?.platforms,
      data?.platform ?? data.platform ?? null
    );
    return {
      ...data,
      platform: loginMethod,
      loginMethod
    };
  }
  async authenticateRequest(req) {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session2 = await this.verifySession(sessionCookie);
    if (!session2) {
      throw ForbiddenError("Invalid session cookie");
    }
    if (session2.openId.startsWith(CRON_OPEN_ID_PREFIX)) {
      const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
      const taskUid = userInfo.taskUid ?? null;
      if (!taskUid) {
        throw ForbiddenError("Cron session missing task_uid");
      }
      return buildCronUser(userInfo);
    }
    const sessionUserId = session2.openId;
    const signedInAt = /* @__PURE__ */ new Date();
    let user = await getUserByOpenId(sessionUserId);
    if (!user) {
      try {
        const userInfo = await this.getUserInfoWithJwt(sessionCookie ?? "");
        await upsertUser({
          openId: userInfo.openId,
          name: userInfo.name || null,
          email: userInfo.email ?? null,
          loginMethod: userInfo.loginMethod ?? userInfo.platform ?? null,
          lastSignedIn: signedInAt
        });
        user = await getUserByOpenId(userInfo.openId);
      } catch (error) {
        console.error("[Auth] Failed to sync user from OAuth:", error);
        throw ForbiddenError("Failed to sync user info");
      }
    }
    if (!user) {
      throw ForbiddenError("User not found");
    }
    await upsertUser({
      openId: user.openId,
      lastSignedIn: signedInAt
    });
    return user;
  }
};
var CRON_OPEN_ID_PREFIX = "cron_";
function buildCronUser(userInfo) {
  const now = /* @__PURE__ */ new Date();
  return {
    id: -1,
    openId: userInfo.openId,
    name: userInfo.name || "Manus Scheduled Task",
    email: null,
    loginMethod: null,
    role: "user",
    createdAt: now,
    updatedAt: now,
    lastSignedIn: now,
    taskUid: userInfo.taskUid ?? void 0,
    isCron: true
  };
}
var sdk = new SDKServer();

// server/_core/scheduled.ts
function isVercelCronAuthorized(req) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) return false;
  const authHeader = req.headers?.["authorization"] ?? "";
  return authHeader === `Bearer ${cronSecret}`;
}
async function syncLinkArtemisScheduledHandler(req, res) {
  try {
    let isAuthorized = false;
    let authSource = "unknown";
    if (isVercelCronAuthorized(req)) {
      isAuthorized = true;
      authSource = "vercel-cron";
    } else {
      try {
        const user = await sdk.authenticateRequest(req);
        if (user.isCron && user.taskUid) {
          isAuthorized = true;
          authSource = "manus-heartbeat";
        }
      } catch {
      }
    }
    if (!isAuthorized) {
      res.status(403).json({ error: "cron-only" });
      return;
    }
    const summary = await syncLinkArtemis(upsertSyncedArticle);
    await recordAudit(
      { req, user: null },
      {
        action: "content.sync.scheduled",
        targetType: "system",
        detail: `source=${authSource} fetched=${summary.fetched} inserted=${summary.inserted} updated=${summary.updated} skipped=${summary.skipped} errors=${summary.errors.length}`
      }
    );
    res.json({ ok: true, summary });
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : void 0;
    res.status(500).json({
      error,
      stack,
      context: { url: req.originalUrl, taskUid: (req.body && req.body.taskUid) ?? null },
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
}

// server/_core/canonicalHost.ts
var APEX = "rebootblood.clinic";
var CANONICAL_HOST = "www.rebootblood.clinic";
function canonicalRedirectTarget(hostHeader, originalUrl) {
  if (!hostHeader) return null;
  const host = hostHeader.split(":")[0].trim().toLowerCase();
  if (host !== APEX) return null;
  const path3 = originalUrl || "/";
  return `https://${CANONICAL_HOST}${path3}`;
}
function canonicalHostRedirect(req, res, next) {
  const target = canonicalRedirectTarget(req.headers.host, req.originalUrl);
  if (target) {
    res.redirect(301, target);
    return;
  }
  next();
}

// server/_core/index.ts
function isPortAvailable(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}
async function findAvailablePort(startPort = 3e3) {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}
function createApp() {
  const app2 = express2();
  app2.use(canonicalHostRedirect);
  app2.use(express2.json({ limit: "50mb" }));
  app2.use(express2.urlencoded({ limit: "50mb", extended: true }));
  registerStorageProxy(app2);
  registerOAuthRoutes(app2);
  app2.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext
    })
  );
  app2.post("/api/scheduled/syncLinkArtemis", syncLinkArtemisScheduledHandler);
  return app2;
}
async function startServer() {
  const app2 = createApp();
  const server = createServer(app2);
  if (process.env.NODE_ENV === "development") {
    await setupVite(app2, server);
  } else {
    serveStatic(app2);
  }
  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);
  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }
  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
if (process.env.VERCEL !== "1") {
  startServer().catch(console.error);
}

// api/_entry.ts
var app = createApp();
var entry_default = app;
export {
  entry_default as default
};
