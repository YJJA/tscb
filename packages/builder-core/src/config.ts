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
import path from "node:path";
import { SRC_DIR } from "./constants.ts";

export interface BuildConfig {
  exports: string | string[] | Record<string, string>;
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

function isRecord(value: unknown): value is Record<string, string> {
  return (
    isObject(value) &&
    !Array.isArray(value) &&
    Object.values(value).every(isString)
  );
}

function checkBuildConfig(config: unknown): config is BuildConfig | undefined {
  if (isUndefined(config)) return true;
  if (!isObject(config)) return false;

  const cexports: unknown = Reflect.get(config, "exports");
  if (!isString(cexports) && !isStringArray(cexports) && !isRecord(cexports))
    return false;
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
  if (isString(config.exports) || isStringArray(config.exports)) {
    const entryFiles = await glob(config.exports, {
      ignore: config?.ignore,
    });

    return Object.fromEntries(
      entryFiles.map((file) => [
        path.relative(
          SRC_DIR,
          file.slice(0, file.length - path.extname(file).length),
        ),
        file,
      ]),
    );
  } else {
    return config.exports;
  }
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
