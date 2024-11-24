import { authProcedure, helloProcedure } from "./routes/index.js";
import { t } from "./trpc.js";
/**
 * appRouter is the collection of routes that we make available
 */
export const appRouter = t.router({
    hello: helloProcedure,
    auth: authProcedure,
});

export const createCaller = t.createCallerFactory(appRouter);

/**
 * AppRouter is the type of the above appRouter. We specify it to reduce the load on the linter
 */
export type AppRouter = typeof appRouter;
export type AppCaller = ReturnType<typeof createCaller>;
