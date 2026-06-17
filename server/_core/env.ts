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
};
