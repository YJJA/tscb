import { glob } from "glob";
import { readFile } from "node:fs/promises";
import assert from "node:assert";
import path from "node:path";
import { isObject, isString, isStringArray } from "payload-is";
import type { ExternalOption } from "rollup";
import { makeRe } from "minimatch";
import { z } from "zod/v4";
import { paths } from "./paths.ts";
import { SRC_DIR } from "./constants.ts";

// Type Guards
const BuildConfig = z
  .object({
    /**
     * The entry files for the build.
     * Can be a string, an array of strings, or a record mapping names to file paths.
     * Defaults to the source index file.
     * If a string or array is provided, it will be globbed to find matching files.
     * If a record is provided, it will be used as is.
     * If the entry files are not specified, it defaults to the source index file. {@link paths.srcIndexFile}
     * @see {@link https://rollupjs.org/configuration-options/#input}
     * @default paths.srcIndexFile
     */
    exports: z
      .union([
        z.string(),
        z.array(z.string()),
        z.record(z.string(), z.string()),
      ])
      .default(paths.srcIndexFile),

    /**
     * Files to ignore during the build.
     * Can be a single string or an array of strings.
     * These files will be excluded from the build process.
     * @see {@linkhttps://github.com/isaacs/node-glob}
     */
    ignore: z.union([z.string(), z.array(z.string())]).optional(),

    /**
     * Packages to bundle with the build.
     * Can be a boolean, an array of strings, or undefined.
     * If true, all dependencies will be bundled.
     * If false, no packages will be bundled.
     * If an array is provided, only those packages will be bundled.
     * @default false
     * @see {@link https://api-extractor.com/pages/configs/api-extractor_json/#bundledpackages}
     */
    bundled: z.union([z.boolean(), z.array(z.string())]).default(false),

    /**
     * Whether to clean the output directory before building.
     * @default false
     */
    clean: z.boolean().default(false),

    /**
     * Whether to enable tree-shaking during the build.
     * @default true
     * @see {@link https://rollupjs.org/configuration-options/#treeshake}
     */
    treeshake: z.boolean().default(true),

    /**
     * Whether to minify the output files.
     * @default false
     */
    minify: z.boolean().default(false),
  })
  .strict();

// BuildConfig Type
export type BuildConfig = z.infer<typeof BuildConfig>;

// PackageJson Type
export type PackageJson = Record<string, unknown>;

// readPackageJson
export async function readPackageJson() {
  const pkgJson = await readFile(paths.packageJson, "utf8");
  const pkg: unknown = JSON.parse(pkgJson);
  assert(isObject(pkg), "package.json format error.");
  return pkg as PackageJson;
}

// readBuildConfig
export function readBuildConfig(pkg: PackageJson): BuildConfig {
  const config: unknown = Reflect.get(pkg, "x-build") ?? {};
  const result = BuildConfig.safeParse(config);
  if (result.success === false) {
    throw new TypeError(`Invalid build configuration`, { cause: result.error });
  }
  return result.data;
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
export function readExternal({ bundled }: BuildConfig): ExternalOption {
  if (bundled === true) {
    return [];
  } else if (Array.isArray(bundled)) {
    const regexps = bundled
      .map((pkg) => makeRe(pkg))
      .filter((re) => re !== false);

    return (source: string) => {
      return !regexps.some((re) => re.test(source));
    };
  }

  return /node_modules/;
}

// readBundledPackages
export function readBundledPackages(
  config: BuildConfig,
  pkg: PackageJson,
): string[] {
  if (config.bundled === true) {
    return Object.keys(pkg.dependencies ?? {}).concat(
      Object.keys(pkg.devDependencies ?? {}),
    );
  }

  if (Array.isArray(config.bundled)) {
    return config.bundled;
  }

  return [];
}

// extensions
export const extensions = [".js", ".cjs", ".mjs", ".ts", ".cts", ".mts"];
