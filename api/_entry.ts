/**
 * Vercel serverless function source (bundled by esbuild into _bundle.mjs).
 */
import { createApp } from "../server/_core/app";

const app = createApp();
export default app;
