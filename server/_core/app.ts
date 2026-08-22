import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { registerStorageProxy } from "./storageProxy";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { syncLinkArtemisScheduledHandler } from "./scheduled";
import { canonicalHostRedirect } from "./canonicalHost";

/**
 * Create the environment-agnostic Express application.
 *
 * This module intentionally does not import Vite or static-file development
 * helpers. Vercel can therefore initialize the Serverless Function without
 * loading Rollup's native optional dependency at runtime.
 */
export function createApp() {
  const app = express();

  app.use(canonicalHostRedirect);
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  registerStorageProxy(app);
  registerOAuthRoutes(app);

  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.post("/api/scheduled/syncLinkArtemis", syncLinkArtemisScheduledHandler);

  return app;
}

