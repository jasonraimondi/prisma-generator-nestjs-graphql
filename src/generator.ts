import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";

import { GENERATOR_NAME } from "./constants";
import { writeFile } from "./utils/writeFile";
import { generateModelTemplate } from "./templates/model_template";
import { generateDtoTemplate } from "./templates/dto_template";
import { registerEnumsTemplate } from "./templates/register_enum_template";

const { version } = require("../package.json");

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: "../generated",
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const clientPath = String(options.generator.config.clientPath ?? "@prisma/client");
    const prefix = String(options.generator.config.prefix ?? "Base");
    const abstract = options.generator.config.abstract?.toString() === "true"; // defaults to false
    const compileJs = options.generator.config.compileJs?.toString() !== "false"; // defaults to true
    const writePath = (filePath: string) => path.join(options.generator.output?.value!, filePath);

    for (const modelInfo of options.dmmf.datamodel.models) {
      const modelTemplate = generateModelTemplate({ clientPath, prefix, abstract }, modelInfo);
      const modelPath = writePath(`/${modelInfo.name}.model.ts`);
      await writeFile(modelPath, modelTemplate, compileJs);

      const dtoTemplate = generateDtoTemplate({ clientPath, prefix }, modelInfo);
      const dtoPath = writePath(`/${modelInfo.name}.dto.ts`);
      await writeFile(dtoPath, dtoTemplate, compileJs);
    }

    const registerEnumsPath = writePath(`register.ts`);
    await writeFile(
      registerEnumsPath,
      registerEnumsTemplate(clientPath, {
        enums: options.dmmf.datamodel.enums,
      }),
      compileJs,
    );

    const contents = await fs.readFile(path.join(__dirname, "../copy/paginator.ts"));
    await writeFile(writePath("/paginator.ts"), contents.toString(), compileJs);

    const globPath = writePath(`/`);
    const files = (await fs.readdir(globPath)).map(name => name.replace(".ts", ""));
    const exports = files
      .filter(file => file !== "index")
      .map(file => `export * from "./${file}";`)
      .join("\n");
    await writeFile(globPath + "index.ts", exports, compileJs);
  },
});
