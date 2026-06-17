import crypto from "node:crypto";
import { ENV } from "./env";

/**
 * PHI (Protected Health Information) application-layer encryption.
 *
 * All patient questionnaire answers and lead contact details are encrypted with
 * AES-256-GCM before being written to the database. This provides encryption at
 * rest at the application layer, independent of (and in addition to) any storage
 * level encryption.
 *
 * Format of the stored string: base64(iv).base64(authTag).base64(ciphertext)
 *
 * Key resolution:
 *  - Production / preferred: PHI_ENCRYPTION_KEY env (64-char hex = 32 bytes).
 *  - Dev fallback: derive a 32-byte key from JWT_SECRET via SHA-256 so local
 *    development works without extra setup. This fallback MUST NOT be relied on
 *    for real PHI in production (it is logged as a warning once).
 */

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit nonce recommended for GCM

let warnedFallback = false;

function resolveKey(): Buffer {
  const raw = ENV.phiEncryptionKey?.trim();
  if (raw && /^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }
  // Dev fallback: derive deterministic key from cookie secret.
  if (!warnedFallback) {
    console.warn(
      "[PHI] PHI_ENCRYPTION_KEY missing or not a 64-char hex string. " +
        "Falling back to a key derived from JWT_SECRET. Do NOT use this for real PHI in production.",
    );
    warnedFallback = true;
  }
  const seed = ENV.cookieSecret || "rebootblood-dev-seed";
  return crypto.createHash("sha256").update(seed).digest();
}

/** Encrypt a UTF-8 string, returning the packed token. */
export function encryptString(plaintext: string): string {
  const key = resolveKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), ciphertext.toString("base64")].join(".");
}

/** Decrypt a packed token back to its UTF-8 string. Throws if tampered/invalid. */
export function decryptString(token: string): string {
  const key = resolveKey();
  const parts = token.split(".");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted payload format");
  }
  const [ivB64, tagB64, dataB64] = parts;
  const iv = Buffer.from(ivB64, "base64");
  const authTag = Buffer.from(tagB64, "base64");
  const ciphertext = Buffer.from(dataB64, "base64");
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(authTag);
  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext.toString("utf8");
}

/** Encrypt an arbitrary JSON-serializable object. */
export function encryptJson(value: unknown): string {
  return encryptString(JSON.stringify(value));
}

/** Decrypt and parse a JSON object encrypted with `encryptJson`. */
export function decryptJson<T = unknown>(token: string): T {
  return JSON.parse(decryptString(token)) as T;
}

/**
 * One-way hash for coarse, non-reversible audit metadata (e.g. IP address).
 * Salted with the cookie secret so hashes are not portable across deployments.
 */
export function hashForAudit(input: string | undefined | null): string | null {
  if (!input) return null;
  return crypto
    .createHash("sha256")
    .update(`${ENV.cookieSecret || "salt"}:${input}`)
    .digest("hex")
    .slice(0, 32);
}

/** True when a strong, explicitly-provided production key is configured. */
export function isStrongKeyConfigured(): boolean {
  const raw = ENV.phiEncryptionKey?.trim();
  return !!raw && /^[0-9a-fA-F]{64}$/.test(raw);
}
