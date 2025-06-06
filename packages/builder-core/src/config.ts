import { glob } from "glob";
import { readFile } from "node:fs/promises";
import assert from "node:assert";
import {
  isBoolean,
  isObject,
  isString,
  isStringArray,
  isUndefined,
} from "payload-is";
import { paths } from "./paths.js";

export interface BuildConfig {
  exports: string | string[];
  ignore?: string | string[];
  clean?: boolean;
  treeshake?: boolean;
  external?: boolean | string[];
}

export type PackageJson = Record<string, unknown>;

// buildConfigDefault
const buildConfigDefault: BuildConfig = {
  exports: paths.srcIndexFile,
};

// readPackageJson
export async function readPackageJson() {
  const pkgJson = await readFile(paths.packageJson, "utf8");
  const pkg: unknown = JSON.parse(pkgJson);
  assert(isObject(pkg), "package.json format error.");
  return pkg as PackageJson;
}

function checkBuildConfig(config: unknown): config is BuildConfig | undefined {
  if (isUndefined(config)) return true;
  if (!isObject(config)) return false;

  const cexports: unknown = Reflect.get(config, "exports");
  if (!isString(cexports) && !isStringArray(cexports)) return false;

  const ignore: unknown = Reflect.get(config, "ignore");
  if (!isUndefined(ignore) && !isString(ignore) && !isStringArray(ignore))
    return false;

  const clean: unknown = Reflect.get(config, "clean");
  if (!isUndefined(clean) && !isBoolean(clean)) return false;

  const treeshake: unknown = Reflect.get(config, "treeshake");
  if (!isUndefined(treeshake) && !isBoolean(treeshake)) return false;

  const external: unknown = Reflect.get(config, "external");
  if (
    !isUndefined(external) &&
    !isBoolean(external) &&
    !isStringArray(external)
  )
    return false;

  return true;
}

// readBuildConfig
export function readBuildConfig(pkg: PackageJson) {
  const config: unknown = Reflect.get(pkg, "x-build");
  assert(checkBuildConfig(config), "x-build config format error.");
  return config ?? buildConfigDefault;
}

// readEntryFiles
export async function readEntryFiles(config: BuildConfig) {
  const entryFiles = await glob(config.exports, {
    ignore: config?.ignore,
  });
  assert(entryFiles.length > 0, "Not found entry file.");

  return entryFiles;
}

// readExternal
export function readExternal(config: BuildConfig) {
  if (config.external === true) {
    return [/node_modules/];
  }

  if (isStringArray(config.external)) {
    return config.external;
  }

  return [];
}
