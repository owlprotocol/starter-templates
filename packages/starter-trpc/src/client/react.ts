import { createTRPCReact } from "@trpc/react-query";
import { HTTPHeaders, httpBatchLink } from "@trpc/client";
import { AppRouter } from "../router.js";
export type { AppRouter };
export * from "./client.js";

export type AppReactQuery = ReturnType<typeof createTRPCReact<AppRouter>>;
export const trpc: AppReactQuery = createTRPCReact<AppRouter>();

/**
 * Create React TRPC Client
 * @param apiKey
 * @param url
 * @returns
 */
export function createClient(
    headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>),
    url = "http://localhost:3000/api/trpc",
): ReturnType<(typeof trpc)["createClient"]> {
    return trpc.createClient({
        links: [
            httpBatchLink({
                url,
                headers,
            }),
        ],
    });
}

//TODO: For SSR useState
/**
 * Create React TRPC Client Hook
 * @param url
 * @returns
 */
export function useClient(
    headers: () => Promise<Record<string, string>>,
    url = "http://localhost:3000/api/trpc",
): [ReturnType<(typeof trpc)["createClient"]>] {
    const trpcClient = trpc.createClient({
        links: [
            httpBatchLink({
                url,
                headers,
            }),
        ],
    });

    return [trpcClient];
}
