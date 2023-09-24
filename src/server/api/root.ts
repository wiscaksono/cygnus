import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { authRouter } from "./routers/auth";
import { pelamarRouter } from "./routers/pelamar";
import { teamRouter } from "./routers/team";
import { userRouter } from "./routers/user";

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  auth: authRouter,
  pelamar: pelamarRouter,
  team: teamRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
