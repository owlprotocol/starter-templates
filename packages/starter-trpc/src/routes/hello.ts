import { z } from "zod";
import { t } from "../trpc.js";

/**
 * @param name
 * @returns Hello World message
 */
export const helloProcedure = t.procedure
    .meta({
        openapi: {
            method: "GET" as const,
            path: "/hello" as const,
            protect: true,
            description: "Hello world demo. Add optional input message",
            summary: "Hello",
            tags: ["API"],
            example: {
                request: {
                    message: "Good morning!",
                },
                response: {
                    message: "Hello World!\nEcho: Good morning!",
                },
            },
        },
    })
    .input(z.object({ message: z.string().optional() }).optional())
    .output(z.object({ message: z.string() }))
    .query(({ input }) => {
        console.debug({ input });
        return {
            //Return hello world + echo message if given
            message: `Hello World!\nEcho: ${input?.message ?? "No message"}`,
        };
    });
