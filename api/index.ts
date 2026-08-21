/**
 * Vercel Serverless Function entry point.
 *
 * Vercel routes all /api/* requests here. The Express app handles
 * tRPC, OAuth, scheduled endpoints, and storage proxy.
 */
import { createApp } from "../server/_core/index";

const app = createApp();

export default app;
