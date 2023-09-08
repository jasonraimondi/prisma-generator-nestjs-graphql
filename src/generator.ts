import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";

import { GENERATOR_NAME } from "./constants/constants";
import { writeFile } from "./utils/writeFile";
import { generateDtoTemplate } from "./templates/dto_template";
import { registerEnumsTemplate } from "./templates/register_enum_template";
import { transformDMMF } from "./utils/transformDMMF";
import { generateModelTemplate } from "./templates/generate_model_template";

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

    const newDMMF = transformDMMF(options.dmmf, { prefix });

    for (const model of newDMMF) {
      const modelTemplate = generateModelTemplate(model, { clientPath, prefix, abstract });
      const modelPath = writePath(`/${model.name}.model.ts`);
      await writeFile(modelPath, modelTemplate, compileJs);
    }

    for (const model of options.dmmf.datamodel.models) {
      const dtoTemplate = generateDtoTemplate({ clientPath, prefix }, model);
      const dtoPath = writePath(`/${model.name}.dto.ts`);
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
