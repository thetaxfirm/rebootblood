/**
 * Vercel Serverless Function entry point.
 * Imports the pre-built Express app from the esbuild bundle.
 */
import { createApp } from "../dist/index.js";

const app = createApp();

export default app;
