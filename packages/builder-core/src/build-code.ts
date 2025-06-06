import path from "node:path";
import { rollup, type Plugin } from "rollup";
import { paths } from "./paths.ts";
import { readExternal, type PackageJson } from "./config.ts";
import type { FilterPattern } from "@rollup/pluginutils";

export interface AdapterOptions {
  targets: string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export type AdapterFunction = (input: AdapterOptions) => Plugin;

// buildCode
export async function buildCode(
  pkg: PackageJson,
  entryFiles: string[],
  adapter: AdapterFunction,
) {
  const input = Object.fromEntries(
    entryFiles.map((file) => [
      path.relative(
        "src",
        file.slice(0, file.length - path.extname(file).length),
      ),
      paths.resolve(file),
    ]),
  );

  const external = readExternal(pkg);

  // esm
  const esmbundle = await rollup({
    input,
    external,
    plugins: [
      adapter({
        targets: [
          "defaults",
          "fully supports es6-module",
          "maintained node versions",
        ],
      }),
    ],
  });

  await esmbundle.write({
    dir: paths.distEsmDir,
    format: "esm",
    entryFileNames: "[name].js",
    sourcemap: true,
  });

  // cjs
  const cjsbundle = await rollup({
    input,
    external,
    plugins: [
      adapter({
        targets: ["maintained node versions"],
      }),
    ],
  });

  await cjsbundle.write({
    dir: paths.distCjsDir,
    format: "cjs",
    entryFileNames: "[name].cjs",
    sourcemap: true,
    exports: "named",
  });
}
