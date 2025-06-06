#!/usr/bin/env node

import { buildCode, type AdapterFunction } from "./build-code.ts";
import { buildExports } from "./build-exports.ts";
import { buildTypes } from "./build-types.ts";
import { readPackageJson, readBuildConfig, readEntryFiles } from "./config.ts";

export async function build(adapter: AdapterFunction) {
  const pkg = await readPackageJson();
  const buildConfig = readBuildConfig(pkg);
  const entryFiles = await readEntryFiles(buildConfig);

  await buildTypes(entryFiles);
  await buildCode(pkg, entryFiles, adapter);
  await buildExports(pkg, entryFiles);
}
