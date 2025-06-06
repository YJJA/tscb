import { Project } from "ts-morph";
import { paths } from "./paths.ts";

// buildTypes
export async function buildTypes(entryFiles: string[]) {
  const project = new Project({
    tsConfigFilePath: paths.tsconfigJson,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      noEmit: false,
      noEmitOnError: true,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: paths.distTypesDir,
    },
  });

  project.addSourceFilesAtPaths(entryFiles.map((file) => paths.resolve(file)));

  await project.emit({ emitOnlyDtsFiles: true });
}
