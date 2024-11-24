import { initTRPC } from "@trpc/server";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { OpenApiMeta } from "trpc-openapi";

/**
 * Overridable TRPC Context.
 * Context can be extended beyond this interface using middleware.
 */
export type Context = {
    /***** Express Req/Response*****/
    readonly req: {
        body: Record<string, any>;
        headers: Record<string, any>;
        [k: string]: any;
    };
    readonly res?: CreateExpressContextOptions["res"];

    /** Project apiKey. Used for authenticating as service account */
    readonly apiKey?: string;
};

//TODO: What does this do?
export const t = initTRPC
    .context<Context>()
    .meta<OpenApiMeta>()
    .create({
        errorFormatter: ({ error, shape }) => {
            console.debug(error);
            if (error.code === "INTERNAL_SERVER_ERROR" && process.env.NODE_ENV === "production") {
                return { ...shape, message: "Internal server error" };
            }
            return shape;
        },
    });

/**
 * createContext creates the initial context. Middlewares can add to this context
 * NOTE: This is only called in the express server when a request is made.
 * When testing you need to create to create a context and pass it to a procedure call
 */
export const createContext = async ({ req, res }: CreateExpressContextOptions): Promise<Context> => {
    return {
        req,
        res,
    } as Context;
};
