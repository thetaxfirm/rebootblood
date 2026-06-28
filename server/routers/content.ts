import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { recordAudit } from "../_core/audit";
import { syncLinkArtemis } from "../_core/linkartemis";
import {
  upsertSyncedArticle,
  listSyncedArticles,
  getSyncedArticleById,
  listPublishedSyncedArticles,
  getPublishedSyncedArticleBySlug,
  setSyncedArticleStatus,
} from "../db";

const syncedStatusEnum = z.enum(["pending", "published", "hidden"]);

/** Shape a synced article row into a safe public/admin DTO (parse keywords JSON). */
function toDto(r: Awaited<ReturnType<typeof getSyncedArticleById>>) {
  if (!r) return r;
  let keywords: string[] = [];
  try {
    keywords = r.keywords ? (JSON.parse(r.keywords) as string[]) : [];
  } catch {
    keywords = [];
  }
  return {
    id: r.id,
    source: r.source,
    remoteId: r.remoteId,
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt ?? "",
    metaDescription: r.metaDescription ?? "",
    heroImageUrl: r.heroImageUrl ?? "",
    keywords,
    languageCode: r.languageCode ?? "",
    contentHtml: r.contentHtml,
    status: r.status,
    remoteCreatedAt: r.remoteCreatedAt,
    publishedAt: r.publishedAt,
    lastSyncedAt: r.lastSyncedAt,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export const contentRouter = router({
  /* ------------------------------ Public reads ------------------------------ */

  /** Published synced articles for the Learning Center list (no body). */
  listPublished: publicProcedure.query(async () => {
    const rows = await listPublishedSyncedArticles();
    return rows.map((r) => {
      const dto = toDto(r)!;
      // Omit full body from the list payload to keep it light.
      const { contentHtml: _omit, ...rest } = dto;
      return rest;
    });
  }),

  /** A single published synced article by slug (for /learn/:slug rendering). */
  getPublishedBySlug: publicProcedure
    .input(z.object({ slug: z.string().min(1) }))
    .query(async ({ input }) => {
      const row = await getPublishedSyncedArticleBySlug(input.slug);
      if (!row) return null;
      return toDto(row);
    }),

  /* ------------------------- Admin: sync + review queue ------------------------- */

  /** Trigger a sync from LinkArtemis. New articles arrive as "pending". */
  runSync: adminProcedure.mutation(async ({ ctx }) => {
    const summary = await syncLinkArtemis(upsertSyncedArticle);
    await recordAudit(ctx, {
      action: "content.sync",
      targetType: "system",
      detail: `fetched=${summary.fetched} inserted=${summary.inserted} updated=${summary.updated} skipped=${summary.skipped} errors=${summary.errors.length}`,
    });
    return summary;
  }),

  /** Admin list of synced articles (any status), optionally filtered. */
  listSynced: adminProcedure
    .input(z.object({ status: syncedStatusEnum.optional() }).optional())
    .query(async ({ input, ctx }) => {
      const rows = await listSyncedArticles(input?.status);
      await recordAudit(ctx, {
        action: "content.list",
        targetType: "system",
        detail: `count=${rows.length}${input?.status ? ` status=${input.status}` : ""}`,
      });
      return rows.map((r) => {
        const dto = toDto(r)!;
        const { contentHtml: _omit, ...rest } = dto;
        return rest;
      });
    }),

  /** Admin: full synced article (incl. body) for the review/preview drawer. */
  getSynced: adminProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ input, ctx }) => {
      const row = await getSyncedArticleById(input.id);
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      await recordAudit(ctx, {
        action: "content.view",
        targetType: "system",
        targetId: row.slug,
      });
      return toDto(row);
    }),

  /** Admin: publish / hide / send back to pending. */
  setStatus: adminProcedure
    .input(z.object({ id: z.number().int().positive(), status: syncedStatusEnum }))
    .mutation(async ({ input, ctx }) => {
      const row = await getSyncedArticleById(input.id);
      if (!row) throw new TRPCError({ code: "NOT_FOUND" });
      await setSyncedArticleStatus(input.id, input.status);
      await recordAudit(ctx, {
        action: "content.status",
        targetType: "system",
        targetId: row.slug,
        detail: `status=${input.status}`,
      });
      return { success: true } as const;
    }),
});
