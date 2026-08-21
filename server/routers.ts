import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { intakeRouter, adminRouter } from "./routers/intake";
import { contentRouter } from "./routers/content";
import { godaddyRouter } from "./routers/godaddy";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      // Destroy the Passport/express-session
      if ((ctx.req as any).logout) {
        (ctx.req as any).logout(() => {});
      }
      if ((ctx.req as any).session?.destroy) {
        (ctx.req as any).session.destroy(() => {});
      }
      ctx.res.clearCookie("connect.sid");
      return {
        success: true,
      } as const;
    }),
  }),
  intake: intakeRouter,
  admin: adminRouter,
  content: contentRouter,
  godaddy: godaddyRouter,
});

export type AppRouter = typeof appRouter;
