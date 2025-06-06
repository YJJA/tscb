import {
  transform,
  type TransformOptions,
  type TransformResult,
} from "esbuild";
import { createFilter } from "@rollup/pluginutils";
import browserslist from "browserslist-to-esbuild";
import type { Plugin } from "rollup";
import type { AdapterOptions } from "@tscb/builder-core";

export type TransformFunction = (
  src: string,
  options?: TransformOptions,
) => Promise<Pick<TransformResult, "code" | "map"> | null>;

// Create an esbuild adapter for Rollup plugins
export function createEsbuildAdapter(
  transformFn: TransformFunction,
): (input: AdapterOptions) => Plugin {
  return function esbuild(input: AdapterOptions): Plugin {
    const filter = createFilter(input.include, input.exclude);
    return {
      name: "esbuild",
      transform(code, id) {
        if (!filter(id)) return null;

        return transformFn(code, {
          target: browserslist(input.targets),
          loader: "ts",
          sourcemap: true,
          sourcefile: id,
        });
      },
    };
  };
}

// esbuild adapter
export const esbuild = createEsbuildAdapter(transform);
