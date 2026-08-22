/**
 * Vercel Serverless Function entry point.
 * Vercel recognizes this checked-in file as the Serverless Function.
 * The implementation is pre-bundled by the build into api/_bundle.mjs and
 * imported here so runtime module resolution does not depend on TS aliases.
 */
export { default } from "./_bundle.mjs";
