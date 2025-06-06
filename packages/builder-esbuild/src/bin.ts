#!/usr/bin/env node

import { build } from "@tscb/builder-core";
import { esbuild } from "@tscb/esbuild-adapter";

await build(esbuild);
