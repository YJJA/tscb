#!/usr/bin/env node

import { build } from "@tscb/builder-core";
import { swc } from "@tscb/swc-adapter";

await build(swc);
