import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type CookieCall = {
  name: string;
  options?: Record<string, unknown>;
};

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAuthContext() {
  const clearedCookies: CookieCall[] = [];
  const state = { logoutCalled: false, sessionDestroyed: false };

  const user: AuthenticatedUser = {
    id: 1,
    openId: "google_12345",
    email: "care@rebootblood.clinic",
    name: "Admin User",
    loginMethod: "google",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
      logout: (cb: () => void) => {
        state.logoutCalled = true;
        cb();
      },
      session: {
        destroy: (cb: () => void) => {
          state.sessionDestroyed = true;
          cb();
        },
      },
    } as any,
    res: {
      clearCookie: (name: string, options?: Record<string, unknown>) => {
        clearedCookies.push({ name, options });
      },
    } as TrpcContext["res"],
  };

  return { ctx, clearedCookies, state };
}

describe("auth.logout", () => {
  it("destroys the Passport session, clears connect.sid cookie, and reports success", async () => {
    const { ctx, clearedCookies, state } = createAuthContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
    expect(state.logoutCalled).toBe(true);
    expect(state.sessionDestroyed).toBe(true);
    expect(clearedCookies).toHaveLength(1);
    expect(clearedCookies[0]?.name).toBe("connect.sid");
  });
});
