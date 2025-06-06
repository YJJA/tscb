import { createFilter } from "@rollup/pluginutils";
import {
  transformAsync,
  type BabelFileResult,
  type TransformOptions,
} from "@babel/core";
import type { Plugin } from "rollup";
import { extensions, type AdapterOptions } from "@tscb/builder-core";

export type TransformFunction = (
  code: string,
  options?: TransformOptions,
) => Promise<Pick<BabelFileResult, "code" | "map"> | null>;

// Create a Babel adapter for Rollup plugins
export function createBabelAdapter(
  transformFn: TransformFunction,
): (input: AdapterOptions) => Plugin {
  return function babel(input: AdapterOptions): Plugin {
    const filter = createFilter(input.include, input.exclude);

    return {
      name: "babel",
      async transform(code, id) {
        if (!filter(id)) return null;
        if (!extensions.some((ext) => id.endsWith(ext))) return null;

        const result = await transformFn(code, {
          babelrc: false,
          presets: [
            "@babel/preset-typescript",
            [
              "@babel/preset-env",
              { targets: input.targets, loose: true, modules: false },
            ],
          ],
          plugins: ["@babel/plugin-transform-runtime"],
          sourceMaps: true,
          filename: id,
        });
        if (result?.code === null) {
          return null;
        }
        return { code: result?.code, map: result?.map };
      },
    };
  };
}

// Babel adapter
export const babel = createBabelAdapter(transformAsync);
