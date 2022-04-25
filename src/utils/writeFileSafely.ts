import fs from "fs/promises";
import path from "path";
import { formatFile } from "./formatFile";

export async function writeFileSafely(writeLocation: string, content: any) {
  await fs.mkdir(path.dirname(writeLocation), {
    recursive: true,
  });
  content = await formatFile(content);
  await fs.writeFile(writeLocation, content);
}
