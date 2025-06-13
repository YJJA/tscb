import { writeFile } from "node:fs/promises";
import sortPackageJson from "sort-package-json";
import type { BuildConfig, BuildFormat } from "./config.ts";
import { CJS_DIR, DIST_DIR, ESM_DIR, TYPES_DIR } from "./constants.ts";
import { paths } from "./paths.ts";

// buildExports
export async function buildExports(
  pkg: Record<string, any>,
  config: BuildConfig,
  entryFiles: Record<string, string>,
) {
  const entries = createEntries(config, entryFiles);
  const pkgExports = Object.fromEntries([
    ...entries,
    ["./package.json", "./package.json"],
  ]);

  const hasIndex =
    Reflect.has(entryFiles, "index") || Reflect.has(entryFiles, ".");

  const hasFormat = (format: BuildFormat) => {
    return config.format?.includes(format) || config.format?.length === 0;
  };

  let newPkg = Object.assign({}, pkg, {
    exports: pkgExports,
  });

  if (hasIndex && hasFormat("esm")) {
    newPkg = Object.assign(newPkg, {
      type: "module",
      module: `./${DIST_DIR}/${ESM_DIR}/index.js`,
    });
  } else {
    Reflect.deleteProperty(newPkg, "type");
    Reflect.deleteProperty(newPkg, "module");
  }

  if (hasIndex && (hasFormat("cjs") || hasFormat("esm"))) {
    newPkg = Object.assign(newPkg, {
      main: hasFormat("cjs")
        ? `./${DIST_DIR}/${CJS_DIR}/index.cjs`
        : `./${DIST_DIR}/${ESM_DIR}/index.js`,
    });
  } else {
    Reflect.deleteProperty(newPkg, "main");
  }

  if (hasIndex && config.types) {
    newPkg = Object.assign(newPkg, {
      types: `./${DIST_DIR}/${TYPES_DIR}/index.d.ts`,
    });
  } else {
    Reflect.deleteProperty(newPkg, "types");
  }

  // sort package.json
  newPkg = sortPackageJson(newPkg);

  await writeFile(paths.packageJson, JSON.stringify(newPkg, null, 2), "utf8");
}

// createEntries
export function createEntries(
  config: BuildConfig,
  entryFiles: Record<string, string>,
) {
  const hasFormat = (format: BuildFormat) => {
    return config.format?.includes(format) || config.format?.length === 0;
  };

  return Object.entries(entryFiles)
    .map(([name, _file]) => {
      let fileName = name;
      if (name === ".") {
        fileName = "index";
      } else if (name.startsWith("./")) {
        fileName = name.slice(2);
      }

      let exportFields = {};
      const typesPath = `./${DIST_DIR}/${TYPES_DIR}/${fileName}.d.ts`;
      const importPath = `./${DIST_DIR}/${ESM_DIR}/${fileName}.js`;
      const requirePath = `./${DIST_DIR}/${CJS_DIR}/${fileName}.cjs`;

      if (hasFormat("esm") && hasFormat("cjs")) {
        exportFields = {
          import: importPath,
          require: requirePath,
          default: requirePath,
        };
        if (config.types) {
          exportFields = {
            types: typesPath,
            ...exportFields,
          };
        }
      } else if (hasFormat("esm")) {
        if (config.types) {
          exportFields = {
            types: typesPath,
            import: importPath,
            default: importPath,
          };
        } else {
          exportFields = importPath;
        }
      } else if (hasFormat("cjs")) {
        if (config.types) {
          exportFields = {
            types: typesPath,
            require: requirePath,
            default: requirePath,
          };
        } else {
          exportFields = requirePath;
        }
      }

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
