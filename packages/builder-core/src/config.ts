import { glob } from "glob";
import { readFile } from "node:fs/promises";
import assert from "node:assert";
import { builtinModules } from "node:module";
import { paths } from "./paths.js";

export interface BuildConfig {
  exports: string | string[];
  ignore?: string | string[];
  clean?: boolean;
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
  assert(typeof pkg === "object" && pkg !== null, "package.json format error.");
  return pkg as PackageJson;
}

function isStringArray(payload: unknown): payload is string[] {
  return (
    Array.isArray(payload) && payload.every((it) => typeof it === "string")
  );
}

function checkBuildConfig(config: unknown): config is BuildConfig | undefined {
  if (typeof config === "undefined") return true;
  if (typeof config !== "object" || config === null) return false;

  const cexports: unknown = Reflect.get(config, "exports");
  if (typeof cexports !== "string" && !isStringArray(cexports)) return false;

  const ignore: unknown = Reflect.get(config, "ignore");
  if (
    typeof ignore !== "undefined" &&
    typeof ignore !== "string" &&
    !isStringArray(ignore)
  )
    return false;

  const clean: unknown = Reflect.get(config, "clean");
  if (typeof clean !== "undefined" && typeof clean !== "boolean") return false;

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
export function readExternal(pkg: PackageJson) {
  return Object.keys(pkg.dependencies || {})
    .concat(Object.keys(pkg.peerDependencies || {}))
    .concat(builtinModules);
}
