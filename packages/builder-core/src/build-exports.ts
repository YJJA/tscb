import { writeFile } from "node:fs/promises";
import sortPackageJson from "sort-package-json";
import { CJS_DIR, DIST_DIR, ESM_DIR, TYPES_DIR } from "./constants.ts";
import { paths } from "./paths.ts";

// buildExports
export async function buildExports(
  pkg: Record<string, any>,
  entryFiles: Record<string, string>,
) {
  const entries = createEntries(entryFiles);
  const pkgExports = Object.fromEntries([
    ...entries,
    ["./package.json", "./package.json"],
  ]);

  const hasIndex =
    Reflect.has(entryFiles, "index") || Reflect.has(entryFiles, ".");

  let newPkg = pkg;
  if (hasIndex) {
    newPkg = Object.assign({}, pkg, {
      main: `./${DIST_DIR}/${CJS_DIR}/index.cjs`,
      module: `./${DIST_DIR}/${ESM_DIR}/index.js`,
      types: `./${DIST_DIR}/${TYPES_DIR}/index.d.ts`,
      exports: pkgExports,
    });
  } else {
    Reflect.deleteProperty(newPkg, "main");
    Reflect.deleteProperty(newPkg, "module");
    Reflect.deleteProperty(newPkg, "types");
    newPkg = Object.assign({}, pkg, {
      exports: pkgExports,
    });
  }

  // sort package.json
  newPkg = sortPackageJson(newPkg);

  await writeFile(paths.packageJson, JSON.stringify(newPkg, null, 2), "utf8");
}

// createEntries
export function createEntries(entryFiles: Record<string, string>) {
  return Object.entries(entryFiles)
    .map(([name, _file]) => {
      let fileName = name;
      if (name === ".") {
        fileName = "index";
      } else if (name.startsWith("./")) {
        fileName = name.slice(2);
      }

      const exportFields = {
        types: `./${DIST_DIR}/${TYPES_DIR}/${fileName}.d.ts`,
        import: `./${DIST_DIR}/${ESM_DIR}/${fileName}.js`,
        require: `./${DIST_DIR}/${CJS_DIR}/${fileName}.cjs`,
        default: `./${DIST_DIR}/${CJS_DIR}/${fileName}.cjs`,
      };

      let key = name;
      if (name === "index") {
        key = ".";
      } else if (!name.startsWith(".")) {
        key = `./${name}`;
      }
      return [key, exportFields] as const;
    })
    .sort((a, b) => a[0].localeCompare(b[0]));
}
