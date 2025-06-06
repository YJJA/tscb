import { createFilter } from "@rollup/pluginutils";
import { transform, type Options, type Output } from "@swc/core";
import type { Plugin } from "rollup";
import type { AdapterOptions } from "@tscb/builder-core";

export type TransformFunction = (
  src: string,
  options?: Options,
) => Promise<Output>;

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

        return transformFn(code, {
          jsc: {
            parser: {
              syntax: "typescript",
            },
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
