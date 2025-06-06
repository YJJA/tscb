#!/usr/bin/env node

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

  if (!entryFiles || Object.keys(entryFiles).length === 0) {
    throw new Error(
      "No entry files found. Please check your build configuration.",
    );
  }

  if (buildConfig.clean) {
    await rm(paths.distDir, { recursive: true, force: true });
  }

  await buildCode(buildConfig, entryFiles, adapter);
  await buildExports(pkg, entryFiles);
  await buildTypes(entryFiles);
}
