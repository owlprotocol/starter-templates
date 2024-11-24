import { createExpressMiddleware } from "@trpc/server/adapters/express";
import express, { Express } from "express";
import { createOpenApiExpressMiddleware } from "trpc-openapi";
import { appRouter } from "../router.js";
import { createContext } from "../trpc.js";

export const app = express() as Express;

// Handle incoming tRPC requests
app.use("/api/trpc", createExpressMiddleware({ router: appRouter, createContext }));

// Handle incoming OpenAPI requests
//TODO: Why the type error now after refactor?
//@ts-expect-error
app.use("/api", createOpenApiExpressMiddleware({ router: appRouter, createContext }));
