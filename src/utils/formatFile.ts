import prettier from "prettier";
import path from "path";

export async function formatFile(content: string): Promise<string> {
  const prettierRc = path.join(__dirname, "../../");
  return new Promise(resolve => {
    if (!prettier) return resolve(content);
    const options = prettier.resolveConfig(prettierRc);
    if (!options) return resolve(content);
    try {
      const formatted = prettier.format(content, {
        // ...options,
        parser: "typescript",
      });
      resolve(formatted);
    } catch (_) {}
    resolve(content);
  });
}
