import path from "node:path";
import { rollup, type ExternalOption, type Plugin } from "rollup";
import { paths } from "./paths.ts";
import { readExternal, type BuildConfig } from "./config.ts";
import type { FilterPattern } from "@rollup/pluginutils";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export interface AdapterOptions {
  targets: string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export type AdapterFunction = (input: AdapterOptions) => Plugin;

// buildCode
export async function buildCode(
  config: BuildConfig,
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

  const external: ExternalOption = readExternal(config);
  const treeshake = config.treeshake ?? true;

  // esm
  const esmbundle = await rollup({
    input,
    external,
    treeshake,
    plugins: [
      nodeResolve(),
      // @ts-ignore
      commonjs(),
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
    preserveModules: true,
  });

  // cjs
  const cjsbundle = await rollup({
    input,
    external,
    treeshake,
    plugins: [
      nodeResolve(),
      // @ts-ignore
      commonjs(),
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
    preserveModules: true,
    exports: "named",
  });
}
