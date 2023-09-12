import { generatorHandler, GeneratorOptions } from "@prisma/generator-helper";
import { logger } from "@prisma/internals";
import path from "path";
import fs from "fs/promises";

import { GENERATOR_NAME } from "./constants";
import { writeFile } from "./utils/writeFile";
import { registerEnumsTemplate } from "./templates/register_enums";
import { transformDMMF } from "./utils/transformDMMF";
import { generateModelTemplate } from "./templates/model";
import { parseConfig } from "./utils/config";

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
    const config = parseConfig(options.generator.config);

    const writePath = (filePath: string) => path.join(options.generator.output?.value!, filePath);

    const newDMMF = transformDMMF(options.dmmf, config);

    for (const model of newDMMF) {
      const modelTemplate = await generateModelTemplate(model, config);
      const modelPath = writePath(`./${model.name}${config.modelFileSuffix}.ts`);
      await writeFile(modelPath, modelTemplate, config.compileJs);
    }

    const registerEnumsPath = writePath(`./register.ts`);
    await writeFile(
      registerEnumsPath,
      registerEnumsTemplate(config.clientPath, {
        enums: options.dmmf.datamodel.enums,
      }),
      config.compileJs,
    );

    const contents = await fs.readFile(path.join(__dirname, "../copy/paginator.ts"));
    await writeFile(writePath("./paginator.ts"), contents.toString(), config.compileJs);

    const globPath = writePath(`./`);
    const files = (await fs.readdir(globPath)).map(name => name.replace(".ts", ""));
    const exports = files
      .filter(file => file !== "index")
      .map(file => `export * from "./${file}";`)
      .join("\n");
    await writeFile(writePath("./index.ts"), exports, config.compileJs);
  },
});
