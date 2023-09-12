import { ModelOptions } from "../constants";

export function parseConfig(config: Record<string, string | string[] | undefined>): ModelOptions {
  return {
    clientPath: String(config.clientPath ?? "@prisma/client"),
    modelPrefix: String(config.modelPrefix ?? "Abstract"),
    modelSuffix: String(config.modelSuffix ?? "Model"),
    modelFileSuffix: String(config.modelFileSuffix ?? ""),
    useAbstractModels: config.useAbstractModels === "true",
    compileJs: config.compileJs === "true",
    withPaginatorInputs: config.withPaginatorInputs === "true",
  };
}
