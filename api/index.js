/**
 * Vercel Serverless Function entry point.
 * This file is the source that esbuild bundles into api/_bundle.mjs.
 * Vercel deploys api/_bundle.mjs as the actual function.
 *
 * NOTE: If you see this file, the build hasn't run yet.
 * The actual deployed function is api/_bundle.mjs (built by `pnpm build`).
 */
export { default } from "./_bundle.mjs";
