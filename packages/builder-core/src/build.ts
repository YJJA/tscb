#!/usr/bin/env node

import fs from "node:fs";
import { rm } from "node:fs/promises";
import { buildCode, type AdapterFunction } from "./build-code.ts";
import { buildExports } from "./build-exports.ts";
import { buildTypes } from "./build-types.ts";
import { readPackageJson, readBuildConfig, readEntryFiles } from "./config.ts";
import { paths } from "./paths.ts";

export async function build(adapter: AdapterFunction) {
  const pkg = await readPackageJson();
  const buildConfig = readBuildConfig(pkg);
  const entryFiles = await readEntryFiles(buildConfig);

  if (buildConfig.clean && fs.existsSync(paths.distDir)) {
    await rm(paths.distDir, { recursive: true });
  }

  await buildTypes(entryFiles);
  await buildCode(buildConfig, entryFiles, adapter);
  await buildExports(pkg, entryFiles);
}
