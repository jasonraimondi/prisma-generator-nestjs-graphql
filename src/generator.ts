import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";

import { GENERATOR_NAME } from "./constants";
import { writeFile } from "./utils/writeFile";
import { registerEnumsTemplate } from "./templates/register_enums";
import { transformDMMF } from "./utils/transformDMMF";
import { generateModelTemplate } from "./templates/model";

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
    const config = {
      clientPath: String(options.generator.config.clientPath ?? "@prisma/client"),
      prefix: String(options.generator.config.prefix ?? "Base"),
      abstract: options.generator.config.abstract === "true",
      compileJs: options.generator.config.compileJs !== "false",
    };

    const writePath = (filePath: string) => path.join(options.generator.output?.value!, filePath);

    const newDMMF = transformDMMF(options.dmmf, config);

    for (const model of newDMMF) {
      const modelTemplate = await generateModelTemplate(model, config);
      const modelPath = writePath(`/${model.name}.model.ts`);
      await writeFile(modelPath, modelTemplate, config.compileJs);
    }

    const registerEnumsPath = writePath(`register.ts`);
    await writeFile(
      registerEnumsPath,
      registerEnumsTemplate(config.clientPath, {
        enums: options.dmmf.datamodel.enums,
      }),
      config.compileJs,
    );

    const contents = await fs.readFile(path.join(__dirname, "../copy/paginator.ts"));
    await writeFile(writePath("./paginator.ts"), contents.toString(), config.compileJs);

    const globPath = writePath(`/`);
    const files = (await fs.readdir(globPath)).map(name => name.replace(".ts", ""));
    const exports = files
      .filter(file => file !== "index")
      .map(file => `export * from "./${file}";`)
      .join("\n");
    await writeFile("./index.ts", exports, config.compileJs);
  },
});
