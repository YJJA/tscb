import { realpathSync } from "node:fs";
import path from "node:path";
import { CJS_DIR, DIST_DIR, ESM_DIR, SRC_DIR, TYPES_DIR } from "./constants.ts";

const workingDir = realpathSync(process.cwd());
const resolve = (relativePath: string) =>
  path.resolve(workingDir, relativePath);

export const paths = {
  workingDir,
  packageJson: resolve("package.json"),
  tsconfigJson: resolve("tsconfig.json"),
  srcDir: resolve(SRC_DIR),
  distDir: resolve(DIST_DIR),
  srcIndexFile: resolve(`${SRC_DIR}/index.ts`),
  distEsmDir: resolve(`${DIST_DIR}/${ESM_DIR}`),
  distCjsDir: resolve(`${DIST_DIR}/${CJS_DIR}`),
  distTypesDir: resolve(`${DIST_DIR}/${TYPES_DIR}`),
  resolve,
};
