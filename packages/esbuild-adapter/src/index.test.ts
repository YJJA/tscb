import { test } from "node:test";
import { createEsbuildAdapter, type TransformFunction } from "./index.ts";

// mock transform function
const mockTransform: TransformFunction = (code, opts) => {
  return Promise.resolve({
    code: `// transformed: ${opts?.sourcefile}\n${code}`,
    map: "{}",
  });
};

test("createEsbuildAdapter returns a plugin with correct name", async (ctx) => {
  const adapter = createEsbuildAdapter(mockTransform);
  const plugin = adapter({
    include: "**/*.ts",
    exclude: /node_modules/,
    targets: ["node 18"],
  });
  ctx.assert.equal(plugin.name, "esbuild");
});

test("plugin.transform returns null for excluded files", async (ctx) => {
  const adapter = createEsbuildAdapter(mockTransform);
  const plugin = adapter({
    include: "**/*.ts",
    exclude: /node_modules/,
    targets: ["node 18"],
  });

  // @ts-ignore
  const result = await plugin.transform(
    "let a = 1;",
    "/foo/node_modules/bar.ts",
  );
  ctx.assert.equal(result, null);
});

test("plugin.transform calls transformFn for included files", async (ctx) => {
  let called = false;
  const spyTransform: TransformFunction = (_code, opts) => {
    called = true;
    ctx.assert.equal(opts?.sourcefile, "/foo/bar.ts");
    return Promise.resolve({ code: "ok", map: "{}" });
  };
  const adapter = createEsbuildAdapter(spyTransform);
  const plugin = adapter({
    include: "**/*.ts",
    exclude: /node_modules/,
    targets: ["node 18"],
  });

  // @ts-ignore
  const result = await plugin.transform("let a = 1;", "/foo/bar.ts");
  ctx.assert.equal(called, true);
  ctx.assert.deepEqual(result, { code: "ok", map: "{}" });
});
