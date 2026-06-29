import { ENV } from "./env";

/**
 * GoDaddy REST API client (server-side only).
 *
 * Credentials live in project secrets: GODADDY_API_KEY / GODADDY_API_SECRET.
 * Auth uses the `sso-key KEY:SECRET` Authorization header.
 * Docs: https://developer.godaddy.com/doc
 */

export type GoDaddyDomainSummary = {
  domain: string;
  status: string;
  expires: string | null;
  createdAt: string | null;
  renewAuto: boolean;
  locked: boolean;
  privacy: boolean;
  nameServers: string[] | null;
};

export type GoDaddyDnsRecord = {
  type: "A" | "AAAA" | "CNAME" | "MX" | "TXT" | "NS" | "SOA" | "SRV";
  name: string;
  data: string;
  ttl?: number;
  priority?: number;
  service?: string;
  protocol?: string;
  port?: number;
  weight?: number;
};

export type GoDaddyAvailability = {
  domain: string;
  available: boolean;
  definitive: boolean;
  price?: number;
  currency?: string;
  period?: number;
};

/** Build the GoDaddy `sso-key` Authorization header. Pure + unit-tested. */
export function buildGoDaddyAuthHeader(key: string, secret: string): string {
  return `sso-key ${key}:${secret}`;
}

/** True when both GoDaddy credentials are present. */
export function hasGoDaddyCredentials(
  key: string = ENV.godaddyApiKey,
  secret: string = ENV.godaddyApiSecret,
): boolean {
  return Boolean(key && secret);
}

const ALLOWED_RECORD_TYPES = ["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"] as const;

/**
 * Validate a DNS record shape before sending it to GoDaddy.
 * Returns an error string when invalid, or null when OK. Pure + unit-tested.
 */
export function validateDnsRecord(record: Partial<GoDaddyDnsRecord>): string | null {
  if (!record.type || !ALLOWED_RECORD_TYPES.includes(record.type as (typeof ALLOWED_RECORD_TYPES)[number])) {
    return `Unsupported record type: ${record.type ?? "(none)"}`;
  }
  if (!record.name || !record.name.trim()) {
    return "Record name is required (use '@' for the root).";
  }
  if (!record.data || !record.data.trim()) {
    return "Record data/value is required.";
  }
  if (record.ttl != null && (record.ttl < 600 || record.ttl > 604800)) {
    return "TTL must be between 600 and 604800 seconds.";
  }
  if (record.type === "MX" && (record.priority == null || record.priority < 0)) {
    return "MX records require a non-negative priority.";
  }
  return null;
}

class GoDaddyError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "GoDaddyError";
    this.status = status;
  }
}

async function gdFetch<T>(
  path: string,
  init: RequestInit = {},
  { key = ENV.godaddyApiKey, secret = ENV.godaddyApiSecret, baseUrl = ENV.godaddyApiUrl } = {},
): Promise<T> {
  if (!key || !secret) {
    throw new GoDaddyError("GoDaddy credentials are not configured.", 500);
  }
  const res = await fetch(`${baseUrl}${path}`, {
    ...init,
    headers: {
      Authorization: buildGoDaddyAuthHeader(key, secret),
      Accept: "application/json",
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...(init.headers ?? {}),
    },
  });

  const text = await res.text();
  if (!res.ok) {
    let msg = text;
    try {
      const parsed = JSON.parse(text);
      msg = parsed.message || parsed.code || text;
    } catch {
      /* keep raw text */
    }
    throw new GoDaddyError(`GoDaddy API ${res.status}: ${msg}`, res.status);
  }
  if (!text) return undefined as T;
  return JSON.parse(text) as T;
}

/** List domains on the account. */
export async function listDomains(limit = 100): Promise<GoDaddyDomainSummary[]> {
  const raw = await gdFetch<any[]>(`/v1/domains?limit=${limit}`);
  return raw.map((d) => ({
    domain: d.domain,
    status: d.status,
    expires: d.expires ?? null,
    createdAt: d.createdAt ?? null,
    renewAuto: Boolean(d.renewAuto),
    locked: Boolean(d.locked),
    privacy: Boolean(d.privacy),
    nameServers: d.nameServers ?? null,
  }));
}

/** Check availability for a single domain. */
export async function checkAvailability(domain: string): Promise<GoDaddyAvailability> {
  const raw = await gdFetch<any>(`/v1/domains/available?domain=${encodeURIComponent(domain)}`);
  return {
    domain: raw.domain,
    available: Boolean(raw.available),
    definitive: Boolean(raw.definitive),
    price: raw.price,
    currency: raw.currency,
    period: raw.period,
  };
}

/** Suggest alternative domain names for a search phrase. */
export async function suggestDomains(query: string, limit = 10): Promise<string[]> {
  const raw = await gdFetch<any[]>(
    `/v1/domains/suggest?query=${encodeURIComponent(query)}&limit=${limit}`,
  );
  return (raw ?? []).map((x) => x.domain).filter(Boolean);
}

/** Get all DNS records for a domain. */
export async function getRecords(domain: string): Promise<GoDaddyDnsRecord[]> {
  return gdFetch<GoDaddyDnsRecord[]>(`/v1/domains/${encodeURIComponent(domain)}/records`);
}

/**
 * Replace all DNS records of a given type+name with the supplied records.
 * GoDaddy's PUT /records/{type}/{name} replaces that set.
 */
export async function replaceRecords(
  domain: string,
  type: string,
  name: string,
  records: Array<{ data: string; ttl?: number; priority?: number }>,
): Promise<void> {
  await gdFetch<void>(
    `/v1/domains/${encodeURIComponent(domain)}/records/${encodeURIComponent(type)}/${encodeURIComponent(name)}`,
    { method: "PUT", body: JSON.stringify(records) },
  );
}

/** Add records (append) without replacing the whole zone. */
export async function addRecords(domain: string, records: GoDaddyDnsRecord[]): Promise<void> {
  await gdFetch<void>(`/v1/domains/${encodeURIComponent(domain)}/records`, {
    method: "PATCH",
    body: JSON.stringify(records),
  });
}

export { GoDaddyError };
