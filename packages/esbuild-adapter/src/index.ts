import { extname } from "node:path";
import { createFilter } from "@rollup/pluginutils";
import { extensions, type AdapterOptions } from "@tscb/builder-core";
import browserslist from "browserslist-to-esbuild";
import {
  transform,
  type TransformOptions,
  type TransformResult,
} from "esbuild";
import type { Plugin } from "rollup";

export type TransformFunction = (
  src: string,
  options?: TransformOptions,
) => Promise<Pick<TransformResult, "code" | "map"> | null>;

function extToEsbuildLoader(ext: string): TransformOptions["loader"] {
  switch (ext) {
    case ".js":
    case ".cjs":
    case ".mjs":
      return "js";
    case ".ts":
    case ".cts":
    case ".mts":
      return "ts";
    case ".jsx":
      return "jsx";
    case ".tsx":
      return "tsx";
    default:
      return "js";
  }
}

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
        if (!extensions.some((ext) => id.endsWith(ext))) return null;

        return transformFn(code, {
          target: browserslist(input.targets),
          loader: extToEsbuildLoader(extname(id)),
          sourcemap: true,
          sourcefile: id,
        });
      },
    };
  };
}

// esbuild adapter
export const esbuild = createEsbuildAdapter(transform);
