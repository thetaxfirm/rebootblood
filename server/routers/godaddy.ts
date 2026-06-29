import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { adminProcedure, router } from "../_core/trpc";
import {
  addRecords,
  checkAvailability,
  getRecords,
  hasGoDaddyCredentials,
  listDomains,
  replaceRecords,
  suggestDomains,
  validateDnsRecord,
  GoDaddyError,
  type GoDaddyDnsRecord,
} from "../_core/godaddy";

const domainSchema = z
  .string()
  .trim()
  .min(3)
  .max(253)
  .regex(/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Enter a valid domain name");

const recordTypeSchema = z.enum(["A", "AAAA", "CNAME", "MX", "TXT", "NS", "SRV"]);

function wrap(err: unknown): never {
  if (err instanceof GoDaddyError) {
    throw new TRPCError({
      code: err.status === 401 || err.status === 403 ? "UNAUTHORIZED" : "BAD_REQUEST",
      message: err.message,
    });
  }
  throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: (err as Error)?.message ?? "GoDaddy request failed" });
}

export const godaddyRouter = router({
  /** Whether the integration is configured (no secrets leaked). */
  status: adminProcedure.query(() => ({ configured: hasGoDaddyCredentials() })),

  listDomains: adminProcedure
    .input(z.object({ limit: z.number().int().min(1).max(1000).default(100) }).optional())
    .query(async ({ input }) => {
      try {
        return await listDomains(input?.limit ?? 100);
      } catch (err) {
        wrap(err);
      }
    }),

  checkAvailability: adminProcedure
    .input(z.object({ domain: domainSchema }))
    .query(async ({ input }) => {
      try {
        return await checkAvailability(input.domain);
      } catch (err) {
        wrap(err);
      }
    }),

  suggestDomains: adminProcedure
    .input(z.object({ query: z.string().trim().min(2).max(100), limit: z.number().int().min(1).max(25).default(10) }))
    .query(async ({ input }) => {
      try {
        return await suggestDomains(input.query, input.limit);
      } catch (err) {
        wrap(err);
      }
    }),

  getRecords: adminProcedure
    .input(z.object({ domain: domainSchema }))
    .query(async ({ input }) => {
      try {
        return await getRecords(input.domain);
      } catch (err) {
        wrap(err);
      }
    }),

  /** Replace the record set of a given type+name (e.g. point A '@' at a new IP). */
  replaceRecords: adminProcedure
    .input(
      z.object({
        domain: domainSchema,
        type: recordTypeSchema,
        name: z.string().trim().min(1),
        records: z
          .array(
            z.object({
              data: z.string().trim().min(1),
              ttl: z.number().int().min(600).max(604800).optional(),
              priority: z.number().int().min(0).optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ input }) => {
      // Validate each record using the pure helper before sending.
      for (const r of input.records) {
        const err = validateDnsRecord({ type: input.type, name: input.name, ...r });
        if (err) throw new TRPCError({ code: "BAD_REQUEST", message: err });
      }
      try {
        await replaceRecords(input.domain, input.type, input.name, input.records);
        return { success: true } as const;
      } catch (err) {
        wrap(err);
      }
    }),

  addRecords: adminProcedure
    .input(
      z.object({
        domain: domainSchema,
        records: z
          .array(
            z.object({
              type: recordTypeSchema,
              name: z.string().trim().min(1),
              data: z.string().trim().min(1),
              ttl: z.number().int().min(600).max(604800).optional(),
              priority: z.number().int().min(0).optional(),
            }),
          )
          .min(1),
      }),
    )
    .mutation(async ({ input }) => {
      for (const r of input.records) {
        const err = validateDnsRecord(r);
        if (err) throw new TRPCError({ code: "BAD_REQUEST", message: err });
      }
      try {
        await addRecords(input.domain, input.records as GoDaddyDnsRecord[]);
        return { success: true } as const;
      } catch (err) {
        wrap(err);
      }
    }),
});
