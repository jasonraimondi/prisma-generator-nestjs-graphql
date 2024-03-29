import { DMMF } from "@prisma/generator-helper";
import { ModelOptions } from "../constants";

type TypeArgs = Pick<ModelOptions, "modelPrefix" | "modelSuffix">;

export function type(f: DMMF.Field, { modelPrefix, modelSuffix }: TypeArgs) {
  let result: null | string = null;
  if (f.kind === "object") result = `${modelPrefix}${f.type}${modelSuffix}`;
  if (f.kind === "enum") result = `(typeof ${f.type})[keyof typeof ${f.type}]`;
  const map: Record<string, string> = {
    String: "string",
    Int: "number",
    Boolean: "boolean",
    DateTime: "Date",
    Json: "Prisma.JsonValue",
  };
  if (!result) result = map[f.type] ?? f.type;
  const suffix = f.isList && "[]";
  return suffix ? `(${result})${suffix}` : result;
}

type GraphqlTypeArgs = {
  forceOptional?: boolean;
} & Pick<ModelOptions, "modelPrefix" | "modelSuffix">;

export const isRequired = (f: DMMF.Field) => (f.isRequired || f.isId) && !f.relationName;

export function graphqlType(f: DMMF.Field, config: GraphqlTypeArgs) {
  const { forceOptional = false } = config;
  const map: Record<string, string> = {
    DateTime: "Date",
    Json: "GraphQLJSON",
  };
  const result =
    f.kind === "object" ? `${config.modelPrefix}${f.type}${config.modelSuffix}` : `${map[f.type] ?? f.type}`;
  if (f.isList) return `[${result}${!forceOptional && isRequired(f) ? "!]!" : "]"}`;
  return `${result}${!forceOptional && isRequired(f) ? "!" : ""}`;
}

export function getDefaultValue(field: DMMF.Field) {
  if (field.hasDefaultValue) {
    // @ts-ignore
    const name: string = field.default.name;
    if (name === "uuid") return "?? uuid()";
    if (name === "cuid") return "?? cuid()";
    if (name === "now") return "?? new Date()";
    if (name === "autoincrement") return "!";

    if (field.default !== undefined) {
      if (field.kind === "enum") return `?? ${field.type}.${field.default}`;
      return `?? ${field.default}`;
    }
  }

  if (!field.isRequired || field.relationName) return "?? null";
  if (field.isList) return "?? []";
  return false;
}

type GraphqlFieldsArgs = Pick<ModelOptions, "modelPrefix" | "modelSuffix">;

export function graphqlField(f: DMMF.Field, args: GraphqlFieldsArgs) {
  return `@Field(() => ${f.isId ? "ID" : graphqlType(f, args)}, { nullable: ${!isRequired(f)} })`;
}
