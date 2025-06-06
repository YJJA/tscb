#!/usr/bin/env node

import { build } from "@tscb/builder-core";
import { babel } from "@tscb/babel-adapter";

await build(babel);
