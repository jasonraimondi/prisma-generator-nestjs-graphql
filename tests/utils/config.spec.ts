import { describe, it, expect } from "vitest";
import { parseConfig } from "../../src/utils/config";

describe("config", () => {
  it("should parse config successfully", () => {
    const parsedConfig = parseConfig({
      compileJs: "false",
      modelSuffix: "Model",
      modelPrefix: "Abstract",
      useAbstractModels: "true",
    });

    expect(parsedConfig.modelPrefix).toBe("Abstract");
    expect(parsedConfig.modelSuffix).toBe("Model");
    expect(parsedConfig.useAbstractModels).toBe(true);
    expect(parsedConfig.compileJs).toBe(false);
  });
});
