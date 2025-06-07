import { styleText } from "node:util";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import type { FilterPattern } from "@rollup/pluginutils";
import { rollup, type Plugin } from "rollup";
import { readExternal, type BuildConfig } from "./config.ts";
import { paths } from "./paths.ts";

export interface AdapterOptions {
  targets: string[];
  include?: FilterPattern;
  exclude?: FilterPattern;
}

export type AdapterFunction = (input: AdapterOptions) => Plugin;

// buildCode
export async function buildCode(
  config: BuildConfig,
  entryFiles: Record<string, string>,
  adapter: AdapterFunction,
) {
  const input = Object.fromEntries(
    Object.entries(entryFiles).map(([name, file]) => {
      let fileName = name;
      if (name === ".") {
        fileName = "index";
      } else if (name.startsWith("./")) {
        fileName = name.slice(2);
      }
      return [fileName, paths.resolve(file)];
    }),
  );
  const external = readExternal(config);
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
      // @ts-ignore
      json(),
      adapter({
        targets: [
          "defaults",
          "fully supports es6-module",
          "maintained node versions",
        ],
      }),
    ],
    logLevel: "debug",
  });

  const esmOutput = await esmbundle.write({
    dir: paths.distEsmDir,
    format: "esm",
    entryFileNames: "[name].js",
    sourcemap: true,
    // @ts-ignore
    plugins: config.minify ? [terser()] : [],
  });

  console.log(styleText("blue", "Wrote ESM output:"));
  esmOutput.output.forEach((chunk) => {
    console.log(styleText("green", chunk.fileName));
  });
  console.log("");

  // cjs
  const cjsbundle = await rollup({
    input,
    external,
    treeshake,
    plugins: [
      nodeResolve(),
      // @ts-ignore
      commonjs(),
      // @ts-ignore
      json(),
      adapter({
        targets: ["maintained node versions"],
      }),
    ],
    logLevel: "debug",
  });

  const cjsOutput = await cjsbundle.write({
    dir: paths.distCjsDir,
    format: "cjs",
    entryFileNames: "[name].cjs",
    sourcemap: true,
    exports: "named",
    // @ts-ignore
    plugins: config.minify ? [terser()] : [],
  });

  console.log(styleText("blue", "Wrote CJS output:"));
  cjsOutput.output.forEach((chunk) => {
    console.log(styleText("green", chunk.fileName));
  });
  console.log("");
}
