import { buildLibESM, buildDistESM, esmBundleConfig } from "@owlprotocol/esbuild-config";

esmBundleConfig.outfile = "dist/index.js";
esmBundleConfig.plugins = [];
esmBundleConfig.platform = "node";
esmBundleConfig.external = [...esmBundleConfig.external, "firebase-admin", "firebase-functions"];

await Promise.all([buildLibESM(), buildDistESM()]);
