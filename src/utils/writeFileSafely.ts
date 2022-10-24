import fs from "fs/promises";
import path from "path";
import { formatFile } from "./formatFile";
import { compile } from "./compile";

export async function writeFileSafely(writeLocation: string, content: any, compileJs: boolean) {
  await fs.mkdir(path.dirname(writeLocation), {
    recursive: true,
  });

  if (compileJs && writeLocation.endsWith(".ts")) {
    const jsContent = compile(content);
    const jsWriteLocation = writeLocation.replace(".ts", ".js");
    await fs.writeFile(jsWriteLocation, jsContent);
  }

  content = await formatFile(content);
  await fs.writeFile(writeLocation, content);
}
