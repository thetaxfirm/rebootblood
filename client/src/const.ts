export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Generate login URL — now points to the Google OAuth route on the server.
 * The server handles the Google redirect, so the frontend just navigates here.
 */
export const getLoginUrl = (returnPath?: string) => {
  return `${window.location.origin}/api/auth/google`;
};
