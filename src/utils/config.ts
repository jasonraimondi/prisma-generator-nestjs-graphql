import { ModelOptions } from "../constants";

export function parseConfig(config: Record<string, string | string[] | undefined>): ModelOptions {
  return {
    clientPath: String(config.clientPath ?? "@prisma/client"),
    modelPrefix: String(config.modelPrefix ?? ""),
    modelSuffix: String(config.modelSuffix ?? ""),
    modelFileSuffix: String(config.modelFileSuffix ?? ""),
    useAbstractModels: config.useAbstractModels !== "false",
    compileJs: config.compileJs === "true",
    withPaginatorInputs: config.withPaginatorInputs === "true",
  };
}
