import { extname } from "node:path";
import { createFilter } from "@rollup/pluginutils";
import {
  transform,
  type Options,
  type Output,
  type ParserConfig,
} from "@swc/core";
import { extensions, type AdapterOptions } from "@tscb/builder-core";
import type { Plugin } from "rollup";

export type TransformFunction = (
  src: string,
  options?: Options,
) => Promise<Output>;

function extToSwcParser(ext: string): ParserConfig {
  switch (ext) {
    case ".ts":
    case ".cts":
    case ".mts":
      return { syntax: "typescript" };
    case ".tsx":
      return { syntax: "typescript", tsx: true };
    case ".js":
    case ".cjs":
    case ".mjs":
      return { syntax: "ecmascript" };
    case ".jsx":
      return { syntax: "ecmascript", jsx: true };
    default:
      return { syntax: "ecmascript" };
  }
}

// Create a SWC adapter for Rollup plugins
export function createSwcAdapter(
  transformFn: TransformFunction,
): (input: AdapterOptions) => Plugin {
  return function swc(input: AdapterOptions): Plugin {
    const filter = createFilter(input.include, input.exclude);
    return {
      name: "swc",
      transform(code, id) {
        if (!filter(id)) return null;
        if (!extensions.some((ext) => id.endsWith(ext))) return null;

        return transformFn(code, {
          jsc: {
            parser: extToSwcParser(extname(id)),
            loose: true,
          },
          env: {
            targets: input.targets,
          },
          sourceMaps: true,
          filename: id,
        });
      },
    };
  };
}

// swc adapter
export const swc = createSwcAdapter(transform);
