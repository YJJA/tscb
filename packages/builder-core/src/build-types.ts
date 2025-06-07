import path from "node:path";
import { rm } from "node:fs/promises";
import { Project } from "ts-morph";
import {
  Extractor,
  ExtractorConfig,
  type IExtractorConfigPrepareOptions,
} from "@microsoft/api-extractor";
import { paths } from "./paths.ts";
import { SRC_DIR } from "./constants.ts";

// buildApiExtractor
function buildApiExtractor(
  entryName: string,
  tempName: string,
  bundledPackages: string[] = [],
) {
  const config: IExtractorConfigPrepareOptions = {
    configObject: {
      mainEntryPointFilePath: path.join(paths.distTmpDir, `${tempName}.d.ts`),
      compiler: {
        tsconfigFilePath: paths.tsconfigJson,
      },
      bundledPackages,
      dtsRollup: {
        enabled: true,
        publicTrimmedFilePath: path.join(
          paths.distTypesDir,
          `${entryName}.d.ts`,
        ),
      },
      projectFolder: paths.workingDir,
    },
    configObjectFullPath: undefined,
    packageJsonFullPath: paths.packageJson,
  };

  const extractorConfig = ExtractorConfig.prepare(config);

  const extractorResult = Extractor.invoke(extractorConfig, {
    showVerboseMessages: true,
  });

  return extractorResult;
}

// buildEntryTypes
function buildEntryTypes(
  entryFiles: Record<string, string>,
  bundledPackages: string[] = [],
) {
  const result = Object.entries(entryFiles).map(([name, file]) => {
    let targetName = name;
    if (name === ".") {
      targetName = "index";
    } else if (name.startsWith("./")) {
      targetName = name.slice(2);
    }
    const tempName = path.relative(
      SRC_DIR,
      file.slice(0, file.length - path.extname(file).length),
    );
    return buildApiExtractor(targetName, tempName, bundledPackages);
  });

  const hasError = result.some((r) => r.succeeded === false);
  if (hasError) {
    throw new Error("API Extractor failed to build types.");
  }
}

// emitTypes
export async function emitTypes(entryFiles: Record<string, string>) {
  const project = new Project({
    tsConfigFilePath: paths.tsconfigJson,
    skipAddingFilesFromTsConfig: true,
    compilerOptions: {
      noEmit: false,
      noEmitOnError: true,
      declaration: true,
      emitDeclarationOnly: true,
      outDir: paths.distTmpDir,
    },
  });

  project.addSourceFilesAtPaths(
    Object.values(entryFiles).map((file) => paths.resolve(file)),
  );

  await project.emit({ emitOnlyDtsFiles: true });
}

// buildTypes
export async function buildTypes(
  entryFiles: Record<string, string>,
  bundledPackages: string[] = [],
) {
  await emitTypes(entryFiles);

  buildEntryTypes(entryFiles, bundledPackages);

  await rm(paths.distTmpDir, { recursive: true, force: true });
}
