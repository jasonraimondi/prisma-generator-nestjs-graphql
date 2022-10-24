import * as ts from "typescript";

export function compile(source: string) {
  return ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
}
