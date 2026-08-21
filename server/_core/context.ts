import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { getSessionUser } from "./oauth";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Use Passport session (Google OAuth) instead of Manus SDK
  const user: User | null = getSessionUser(opts.req) ?? null;

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
