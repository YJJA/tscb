#!/usr/bin/env node
import { babel } from "@tscb/babel-adapter";
import { build } from "@tscb/builder-core";

await build(babel);
