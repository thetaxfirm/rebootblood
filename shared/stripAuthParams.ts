/**
 * Pure helper that removes OAuth / auth-callback query params from a URL so they
 * do not linger in the browser address bar after a sign-in redirect (e.g.
 * `https://www.rebootblood.clinic/?code=2SaXmUeEdFdqk5n7eMrn9f`).
 *
 * Kept framework-free and side-effect-free so it can be unit tested and reused.
 * The caller is responsible for applying the result via `history.replaceState`.
 *
 * Behaviour:
 * - Strips a fixed set of auth params (code, state, scope, authuser, prompt,
 *   session_state, error, error_description, error_uri).
 * - Preserves all other query params and their order.
 * - Preserves the path and the hash fragment.
 * - Drops the trailing "?" when no query params remain.
 */

/** Query params produced by OAuth / auth-callback redirects that we want gone. */
export const AUTH_PARAM_KEYS: readonly string[] = [
  "code",
  "state",
  "scope",
  "authuser",
  "prompt",
  "session_state",
  "error",
  "error_description",
  "error_uri",
];

/**
 * Returns true when the given query string (e.g. `window.location.search`)
 * contains at least one auth param worth stripping.
 */
export function hasAuthParams(search: string): boolean {
  if (!search) return false;
  const params = new URLSearchParams(
    search.startsWith("?") ? search.slice(1) : search,
  );
  return AUTH_PARAM_KEYS.some((key) => params.has(key));
}

/**
 * Given a full URL (or a path+search+hash string), return the same URL with the
 * auth params removed. Non-auth params, the path, and the hash are preserved.
 *
 * Accepts both absolute URLs ("https://host/path?code=x#h") and relative ones
 * ("/path?code=x#h"). Uses a dummy base for parsing relative inputs and strips
 * it back out so the return value matches the input's absolute/relative shape.
 */
export function stripAuthParamsFromUrl(input: string): string {
  const DUMMY_BASE = "http://__strip__.local";
  let url: URL;
  let isRelative = false;

  try {
    url = new URL(input);
  } catch {
    isRelative = true;
    url = new URL(input, DUMMY_BASE);
  }

  for (const key of AUTH_PARAM_KEYS) {
    url.searchParams.delete(key);
  }

  if (isRelative) {
    // pathname + (search) + (hash), without the dummy origin.
    return `${url.pathname}${url.search}${url.hash}`;
  }
  return url.toString();
}
