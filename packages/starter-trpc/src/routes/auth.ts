import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { t } from "../trpc.js";

/**
 * @param name
 * @returns Hello World message
 */
export const authProcedure = t.procedure
    .meta({
        openapi: {
            method: "POST" as const,
            path: "/auth" as const,
            protect: true,
            description: "Authenticate with api key in header",
            summary: "Authenticate",
            tags: ["Auth"],
        },
    })
    .input(z.void())
    .output(z.string())
    .mutation(({ ctx }) => {
        const { req } = ctx;
        const reqHeaders = req.headers;
        const apiKey = reqHeaders["x-api-key"] as string | undefined;

        console.debug({ apiKey });

        if (!apiKey) {
            throw new TRPCError({ message: "No API Key", code: "UNAUTHORIZED" });
        }

        return "ok";
    });
