import path from "node:path";
import { writeFile } from "node:fs/promises";
import { paths } from "./paths.ts";
import { CJS_DIR, DIST_DIR, ESM_DIR, SRC_DIR, TYPES_DIR } from "./constants.ts";

// buildExports
export async function buildExports(
  pkg: Record<string, any>,
  entryFiles: string[],
) {
  const entries = createEntries(entryFiles);
  const pkgExports = Object.fromEntries([
    ...entries,
    ["./package.json", "./package.json"],
  ]);

  const newPkg = Object.assign({}, pkg, {
    main: `./${DIST_DIR}/${CJS_DIR}/index.cjs`,
    module: `./${DIST_DIR}/${ESM_DIR}/index.js`,
    types: `./${DIST_DIR}/${TYPES_DIR}/index.d.ts`,
    source: `./${SRC_DIR}/index.ts`,
    exports: pkgExports,
  });
  await writeFile(paths.packageJson, JSON.stringify(newPkg, null, 2), "utf8");
}

// createEntries
export function createEntries(entryFiles: string[]) {
  return entryFiles
    .map((file) => {
      const name = path.relative(
        SRC_DIR,
        file.slice(0, file.length - path.extname(file).length),
      );
      const exportFields = {
        types: `./${DIST_DIR}/${TYPES_DIR}/${name}.d.ts`,
        import: `./${DIST_DIR}/${ESM_DIR}/${name}.js`,
        require: `./${DIST_DIR}/${CJS_DIR}/${name}.cjs`,
        default: `./${DIST_DIR}/${CJS_DIR}/${name}.cjs`,
      };
      const key = name === "index" ? "." : `./${name}`;
      return [key, exportFields] as const;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
}
