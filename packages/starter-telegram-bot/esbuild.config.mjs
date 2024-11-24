import { buildLibESM, buildDistCJS, cjsBundleConfig } from "@owlprotocol/esbuild-config";

cjsBundleConfig.entryPoints = ["src/runtimes/firebase.ts"];
cjsBundleConfig.outfile = "dist/index.js";
cjsBundleConfig.plugins = [];
cjsBundleConfig.platform = "node";
cjsBundleConfig.external = [...cjsBundleConfig.external, "http", "firebase-admin", "firebase-functions"];

await Promise.all([buildLibESM(), buildDistCJS()]);
