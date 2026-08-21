import type { Express, Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import * as db from "../db";
import { ENV } from "./env";

/**
 * Google OAuth 2.0 authentication (replaces Manus OAuth).
 *
 * Flow:
 *   GET /api/auth/google          → redirect to Google consent screen
 *   GET /api/auth/google/callback  → Google redirects back, we upsert user + create session
 *   GET /api/auth/me               → return current session user (JSON)
 *   POST /api/auth/logout          → destroy session
 *
 * The user's Google sub (subject identifier) is stored as `openId` in the
 * users table, keeping compatibility with the existing schema.
 */

// Admin whitelist: only these emails can log in as admin.
// The first login from a whitelisted email auto-promotes to admin.
const ADMIN_EMAILS = new Set([
  "care@rebootblood.clinic",
  // Add more admin emails here as needed
]);

export function registerOAuthRoutes(app: Express) {
  // ─── Session middleware ───────────────────────────────────────────────
  app.use(
    session({
      secret: ENV.cookieSecret || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: ENV.isProduction,
        sameSite: ENV.isProduction ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      },
    })
  );

  app.use(passport.initialize());
  app.use(passport.session());

  // ─── Passport serialization ───────────────────────────────────────────
  passport.serializeUser((user: any, done) => {
    done(null, user.openId);
  });

  passport.deserializeUser(async (openId: string, done) => {
    try {
      const user = await db.getUserByOpenId(openId);
      done(null, user || null);
    } catch (err) {
      done(err, null);
    }
  });

  // ─── Google Strategy ──────────────────────────────────────────────────
  if (ENV.googleClientId && ENV.googleClientSecret) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: ENV.googleClientId,
          clientSecret: ENV.googleClientSecret,
          // callbackURL is built dynamically per-request (see below)
          callbackURL: "/api/auth/google/callback",
          passReqToCallback: true,
        },
        async (req: any, accessToken: string, refreshToken: string, profile: any, done: any) => {
          try {
            const email = profile.emails?.[0]?.value ?? null;
            const googleId = `google_${profile.id}`;
            const name = profile.displayName || profile.name?.givenName || null;

            // Determine role: admin if email is whitelisted
            const isAdmin = email && ADMIN_EMAILS.has(email.toLowerCase());

            await db.upsertUser({
              openId: googleId,
              name,
              email,
              loginMethod: "google",
              lastSignedIn: new Date(),
            });

            // If admin-whitelisted, promote role
            if (isAdmin) {
              const existingUser = await db.getUserByOpenId(googleId);
              if (existingUser && existingUser.role !== "admin") {
                await db.promoteToAdmin(googleId);
              }
            }

            const user = await db.getUserByOpenId(googleId);
            done(null, user);
          } catch (err) {
            done(err, null);
          }
        }
      )
    );

    // ─── Routes ───────────────────────────────────────────────────────────
    app.get("/api/auth/google", (req: Request, res: Response, next: NextFunction) => {
      // Build callback URL from the request origin so it works on any domain
      const protocol = req.headers["x-forwarded-proto"] || req.protocol;
      const host = req.headers["x-forwarded-host"] || req.headers.host;
      const callbackURL = `${protocol}://${host}/api/auth/google/callback`;

      passport.authenticate("google", {
        scope: ["profile", "email"],
        callbackURL,
      } as any)(req, res, next);
    });

    app.get(
      "/api/auth/google/callback",
      (req: Request, res: Response, next: NextFunction) => {
        const protocol = req.headers["x-forwarded-proto"] || req.protocol;
        const host = req.headers["x-forwarded-host"] || req.headers.host;
        const callbackURL = `${protocol}://${host}/api/auth/google/callback`;

        passport.authenticate("google", {
          failureRedirect: "/?auth=failed",
          callbackURL,
        } as any)(req, res, next);
      },
      (req: Request, res: Response) => {
        // Successful authentication — redirect to admin or home
        const user = req.user as any;
        if (user?.role === "admin") {
          res.redirect("/admin");
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    console.warn("[OAuth] Google OAuth credentials not configured — auth disabled.");
  }

  // ─── Legacy-compatible auth endpoints (used by tRPC auth.me / auth.logout) ──
  // These are NOT tRPC — they're plain Express routes that the Manus OAuth
  // callback used to hit. We keep /api/oauth/callback as a redirect to the
  // new Google flow for any stale bookmarks.
  app.get("/api/oauth/callback", (req: Request, res: Response) => {
    res.redirect("/api/auth/google");
  });
}

/**
 * Extract the authenticated user from the express-session (Passport).
 * Used by the tRPC context builder to populate ctx.user.
 */
export function getSessionUser(req: Request): any {
  return (req as any).user ?? null;
}
