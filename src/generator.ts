import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/sdk";
import path from "path";
import { GENERATOR_NAME } from "./constants";
import { writeFileSafely } from "./utils/writeFileSafely";
import { generateModelTemplate } from "./templates/model_template";
import fs from "fs/promises";
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
    const clientPath = options.generator.config.clientPath ?? "@prisma/client";
    const writePath = (filePath: string) => path.join(options.generator.output?.value!, filePath);

    for (const modelInfo of options.dmmf.datamodel.models) {
      const modelTemplate = generateModelTemplate(clientPath, modelInfo);
      const modelPath = writePath(`/${modelInfo.name}.model.ts`);
      console.log(modelPath);
      await writeFileSafely(modelPath, modelTemplate);

      const dtoTemplate = generateDtoTemplate(clientPath, modelInfo);
      const dtoPath = writePath(`/${modelInfo.name}.dto.ts`);
      await writeFileSafely(dtoPath, dtoTemplate);
    }

    const registerEnumsPath = writePath(`register.ts`);
    await writeFileSafely(
      registerEnumsPath,
      registerEnumsTemplate({
        enums: options.dmmf.datamodel.enums,
      }),
    );

    const contents = await fs.readFile(path.join(__dirname, "../copy/paginator.ts"));
    await writeFileSafely(writePath("/paginator.ts"), contents.toString());

    const globPath = writePath(`/`);
    const files = (await fs.readdir(globPath)).map(name => name.replace(".ts", ""));
    const exports = files.map(file => `export * from "./${file}";`).join("\n");
    await writeFileSafely(globPath + "index.ts", exports);
  },
});
