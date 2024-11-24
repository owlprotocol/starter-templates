import { HTTPHeaders, createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import fetch from "cross-fetch";
import { AppRouter } from "../router.js";

/**
 * Create JS TRPC Client
 * @param apiKey
 * @param url
 * @returns
 */
export function createClient(
    auth?: {
        headers?: HTTPHeaders | (() => HTTPHeaders | Promise<HTTPHeaders>);
        apiKey?: string;
        jwt?: string;
    },
    url = "http://localhost:3000/api/trpc",
): AppClient {
    const headersDefault = () => {
        if (auth?.apiKey) {
            return { "x-api-key": auth.apiKey };
        } else if (auth?.jwt) {
            return { authorization: auth.jwt };
        } else {
            return {};
        }
    };
    const headers = auth?.headers ?? headersDefault;

    const client = createTRPCProxyClient<AppRouter>({
        links: [
            httpBatchLink({
                url,
                fetch,
                // You can pass any HTTP headers you wish here
                headers,
            }),
        ],
    });

    return client;
}

export type AppClient = ReturnType<typeof createTRPCProxyClient<AppRouter>>;
