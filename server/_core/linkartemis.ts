import sanitizeHtml from "sanitize-html";
import { ENV } from "./env";
import { RESERVED_LEARN_SLUG_SET } from "../../shared/learnSlugs";
import type { InsertSyncedArticle } from "../../drizzle/schema";

/**
 * LinkArtemis (app.linkartemis.com) integration helpers.
 *
 * The provider API exposes completed articles only:
 *   GET /articles        -> list (summary fields)
 *   GET /articles/:id    -> full article incl. content_html / content_markdown
 * Auth: `X-API-Key: <key>`.
 *
 * This module is intentionally split into:
 *   - pure helpers (sanitizeArticleHtml, mapRemoteArticle, computeSyncResult)
 *     that are unit-tested without network/db, and
 *   - thin network functions (fetchArticleList, fetchArticleDetail) that the
 *     tRPC layer calls.
 */

export type LinkArtemisListItem = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string | null;
  meta_description?: string | null;
  hero_image_url?: string | null;
  keywords?: string[] | null;
  language_code?: string | null;
  created_at?: string | null;
};

export type LinkArtemisArticleDetail = LinkArtemisListItem & {
  content_html?: string | null;
  content_markdown?: string | null;
};

/**
 * Allowlist-based sanitizer for provider HTML. Strips scripts/styles/iframes,
 * keeps semantic article markup, forces safe link/image attributes. Pure.
 */
export function sanitizeArticleHtml(rawHtml: string): string {
  return sanitizeHtml(rawHtml ?? "", {
    allowedTags: [
      "p", "br", "hr",
      "h2", "h3", "h4",
      "ul", "ol", "li",
      "blockquote", "strong", "em", "b", "i", "u", "s", "code", "pre",
      "a", "img", "figure", "figcaption",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "name", "target", "rel"],
      img: ["src", "alt", "title", "loading"],
      "*": ["id"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    // Force external links to open safely; drop javascript: etc. via schemes above.
    transformTags: {
      a: (tagName, attribs) => {
        const href = attribs.href ?? "";
        const isAnchor = href.startsWith("#");
        return {
          tagName: "a",
          attribs: {
            ...attribs,
            ...(isAnchor
              ? {}
              : { target: "_blank", rel: "noopener noreferrer nofollow" }),
          },
        };
      },
      img: (tagName, attribs) => ({
        tagName: "img",
        attribs: { ...attribs, loading: "lazy" },
      }),
    },
    // Disallow inline event handlers / styles implicitly (not in allowedAttributes).
  }).trim();
}

/** Parse a provider ISO timestamp into a Date, or null if absent/invalid. Pure. */
export function parseRemoteDate(iso: string | null | undefined): Date | null {
  if (!iso) return null;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? null : new Date(t);
}

/**
 * Normalize a slug so synced articles can never collide with the reserved,
 * hand-authored Learning Center slugs (passed in by the caller). If the
 * provider slug is empty or reserved, a `la-` prefix is applied. Pure.
 */
export function namespaceSlug(rawSlug: string, reservedSlugs: ReadonlySet<string>): string {
  const base = (rawSlug || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
  if (!base) return "";
  return reservedSlugs.has(base) ? `la-${base}` : base;
}

/**
 * Map a fully-fetched remote article into a DB upsert row. Sanitizes HTML and
 * namespaces the slug. Returns null when the article has no usable content.
 * Pure (no I/O).
 */
export function mapRemoteArticle(
  detail: LinkArtemisArticleDetail,
  reservedSlugs: ReadonlySet<string> = RESERVED_LEARN_SLUG_SET,
): InsertSyncedArticle | null {
  const contentHtml = sanitizeArticleHtml(detail.content_html ?? "");
  const slug = namespaceSlug(detail.slug ?? "", reservedSlugs);
  if (!detail.id || !slug || !contentHtml) return null;
  return {
    source: "linkartemis",
    remoteId: detail.id,
    slug,
    title: detail.title ?? "Untitled",
    excerpt: detail.excerpt ?? null,
    metaDescription: detail.meta_description ?? detail.excerpt ?? null,
    heroImageUrl: detail.hero_image_url ?? null,
    keywords: JSON.stringify(Array.isArray(detail.keywords) ? detail.keywords : []),
    languageCode: detail.language_code ?? null,
    contentHtml,
    remoteCreatedAt: parseRemoteDate(detail.created_at),
    lastSyncedAt: new Date(),
  };
}

type FetchOpts = { apiKey?: string; baseUrl?: string; signal?: AbortSignal };

function authHeaders(apiKey: string): Record<string, string> {
  return { "X-API-Key": apiKey, Accept: "application/json" };
}

/** Network: list completed articles (summary fields). Throws on non-2xx. */
export async function fetchArticleList(opts: FetchOpts = {}): Promise<LinkArtemisListItem[]> {
  const apiKey = opts.apiKey ?? ENV.linkArtemisApiKey;
  const baseUrl = opts.baseUrl ?? ENV.linkArtemisApiUrl;
  if (!apiKey) throw new Error("LINKARTEMIS_API_KEY is not configured");
  const res = await fetch(`${baseUrl}/articles`, {
    headers: authHeaders(apiKey),
    signal: opts.signal,
  });
  if (!res.ok) {
    throw new Error(`LinkArtemis list failed: HTTP ${res.status}`);
  }
  const data = (await res.json()) as unknown;
  return Array.isArray(data) ? (data as LinkArtemisListItem[]) : [];
}

/** Network: fetch full article detail (incl. content_html). Throws on non-2xx. */
export async function fetchArticleDetail(
  id: string,
  opts: FetchOpts = {},
): Promise<LinkArtemisArticleDetail> {
  const apiKey = opts.apiKey ?? ENV.linkArtemisApiKey;
  const baseUrl = opts.baseUrl ?? ENV.linkArtemisApiUrl;
  if (!apiKey) throw new Error("LINKARTEMIS_API_KEY is not configured");
  const res = await fetch(`${baseUrl}/articles/${encodeURIComponent(id)}`, {
    headers: authHeaders(apiKey),
    signal: opts.signal,
  });
  if (!res.ok) {
    throw new Error(`LinkArtemis detail failed (${id}): HTTP ${res.status}`);
  }
  return (await res.json()) as LinkArtemisArticleDetail;
}

/** Lightweight connectivity check used by tests/health. Returns count or throws. */
export async function pingLinkArtemis(opts: FetchOpts = {}): Promise<number> {
  const list = await fetchArticleList(opts);
  return list.length;
}


export type SyncSummary = {
  fetched: number;
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
};

export type SyncDeps = {
  list?: (opts?: FetchOpts) => Promise<LinkArtemisListItem[]>;
  detail?: (id: string, opts?: FetchOpts) => Promise<LinkArtemisArticleDetail>;
};

/**
 * Orchestrate a full sync: list remote articles, fetch each detail, sanitize +
 * map, and upsert via the injected `upsert` function. New rows land as
 * "pending" (DB default); existing rows keep their review status. Both the
 * `upsert` and the network fetchers are injectable so this is fully testable
 * without network or a real database.
 */
export async function syncLinkArtemis(
  upsert: (row: InsertSyncedArticle) => Promise<"inserted" | "updated">,
  opts: FetchOpts = {},
  deps: SyncDeps = {},
): Promise<SyncSummary> {
  const list = deps.list ?? fetchArticleList;
  const detail = deps.detail ?? fetchArticleDetail;
  const summary: SyncSummary = { fetched: 0, inserted: 0, updated: 0, skipped: 0, errors: [] };
  const items = await list(opts);
  summary.fetched = items.length;
  for (const item of items) {
    try {
      const d = await detail(item.id, opts);
      const row = mapRemoteArticle(d);
      if (!row) {
        summary.skipped += 1;
        continue;
      }
      const result = await upsert(row);
      if (result === "inserted") summary.inserted += 1;
      else summary.updated += 1;
    } catch (err) {
      summary.errors.push(`${item.id}: ${(err as Error).message}`);
    }
  }
  return summary;
}
