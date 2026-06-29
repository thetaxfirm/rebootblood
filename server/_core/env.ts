export const ENV = {
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
};
