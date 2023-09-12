import { describe, it, expect } from "vitest";
import { parseConfig } from "../../src/utils/config";

describe("#parseConfig", () => {
  it("defaults correctly", () => {
    const parsedConfig = parseConfig({});

    expect(parsedConfig.clientPath).toBe("@prisma/client");
    expect(parsedConfig.modelPrefix).toBe("");
    expect(parsedConfig.modelSuffix).toBe("");
    expect(parsedConfig.modelFileSuffix).toBe("");
    expect(parsedConfig.useAbstractModels).toBe(true);
    expect(parsedConfig.compileJs).toBe(false);
    expect(parsedConfig.withPaginatorInputs).toBe(false);
  });

  it("parses config correctly", () => {
    const parsedConfig = parseConfig({
      clientPath: "../client/generated",
      modelPrefix: "Abstract",
      modelSuffix: "Model",
      modelFileSuffix: ".model",
      useAbstractModels: "false",
      compileJs: "true",
      withPaginatorInputs: "true",
    });

    expect(parsedConfig.clientPath).toBe("../client/generated");
    expect(parsedConfig.modelPrefix).toBe("Abstract");
    expect(parsedConfig.modelSuffix).toBe("Model");
    expect(parsedConfig.modelFileSuffix).toBe(".model");
    expect(parsedConfig.useAbstractModels).toBe(false);
    expect(parsedConfig.compileJs).toBe(true);
    expect(parsedConfig.withPaginatorInputs).toBe(true);
  });
});
