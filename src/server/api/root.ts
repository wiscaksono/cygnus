import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "./routers/auth";
import { pelamarRouter } from "./routers/pelamar";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";
import { emailTemplateRouter } from "./routers/emailTemplate";
import { chartRouter } from "./routers/chart";
import { trackingPelamarRouter } from "./routers/trackingPelamar";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  pelamar: pelamarRouter,
  team: teamRouter,
  user: userRouter,
  emailTemplate: emailTemplateRouter,
  chart: chartRouter,
  trackingPelamar: trackingPelamarRouter,
});

export type AppRouter = typeof appRouter;
