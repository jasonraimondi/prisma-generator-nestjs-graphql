import fs from "node:fs/promises";
import path from "node:path";

import prettier from "prettier";
import { transpileModule, ModuleKind } from "typescript";

export async function writeFile(writeLocation: string, content: any, compileJs: boolean) {
  await fs.mkdir(path.dirname(writeLocation), {
    recursive: true,
  });

  if (compileJs && writeLocation.endsWith(".ts")) {
    const jsContent = transpileTypescript(content);
    const jsWriteLocation = writeLocation.replace(".ts", ".js");
    await fs.writeFile(jsWriteLocation, jsContent);
  }

  content = await formatWithPrettier(content);
  await fs.writeFile(writeLocation, content);
}

function transpileTypescript(source: string) {
  const transpileOptions = { compilerOptions: { module: ModuleKind.CommonJS } };
  return transpileModule(source, transpileOptions).outputText;
}

async function formatWithPrettier(content: string): Promise<string> {
  try {
    const prettierRc = path.join(__dirname, "../../");
    const options = await prettier.resolveConfig(prettierRc).catch();
    return await prettier.format(content, {
      ...options,
      parser: "typescript",
    });
  } catch (error) {
    return content;
  }
}
