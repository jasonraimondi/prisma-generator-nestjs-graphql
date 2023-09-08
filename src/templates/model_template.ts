import { DMMF } from "@prisma/generator-helper";
import { extractValidations } from "../utils/transformDMMF";
import { ModelOptions } from "./generate_model_template";

export const shouldHide = (documentation?: string) => documentation?.includes("@HideField()") || false;
export const isRequired = (f: DMMF.Field) => (f.isRequired || f.isId) && !f.relationName;
export const isReadOnly = (f: DMMF.Field) => f.isReadOnly || f.isId;
export const needsHideField = (model: DMMF.Model) => model.fields.filter(f => shouldHide(f.documentation)).length > 0;
export const needsIDField = (model: DMMF.Model) => model.fields.filter(f => f.isId).length > 0;
export const needsCuidImport = (model: DMMF.Model) =>
  model.fields.filter((f: any) => f.default?.name === "cuid").length > 0;
export const needsGraphqlJSONImport = (model: DMMF.Model) =>
  model.fields.filter((f: any) => f.type === "Json").length > 0;
export const importCuid = (model: DMMF.Model) => (needsCuidImport(model) ? `import cuid from "cuid";` : "");
export const needsUUIDv4Import = (model: DMMF.Model) =>
  model.fields.filter((f: any) => f.default?.name === "uuid").length > 0;
export const importUUIDv4 = (model: DMMF.Model) =>
  needsUUIDv4Import(model) ? `import { v4 as uuid } from "uuid";` : "";

export const modelPath = (f: DMMF.Field) => `${f.type}.model`;

export function extraNestjsGraphqlFields(model: DMMF.Model) {
  let inputs: string[] = [];
  model.fields
    .filter(f => !f.isId)
    .filter(f => !f.relationName)
    .filter(f => !f.isUpdatedAt)
    .forEach(f => {
      if (f.type === "Int" && !shouldHide(f.documentation)) inputs.push("Int");
    });
  inputs = [...new Set(inputs)];
  return inputs;
}

type TypeArgs = {
  prefix: string;
};

export function importName(f: DMMF.Field, { prefix }: TypeArgs) {
  if (f.kind === "object") return `${prefix}${f.type}`;
  if (f.kind === "enum") return `(typeof ${f.type})[keyof typeof ${f.type}]`;
  return f.type;
}

export function type(f: DMMF.Field, { prefix }: TypeArgs) {
  let result: null | string = null;
  if (f.kind === "object") result = `${prefix}${f.type}`;
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
  prefix: string;
};

export function graphqlType(f: DMMF.Field, args: GraphqlTypeArgs) {
  const { forceOptional = false, prefix } = args;
  const map: Record<string, string> = {
    DateTime: "Date",
    Json: "GraphQLJSON",
  };
  const result = f.kind === "object" ? `${prefix}${f.type}` : `${map[f.type] ?? f.type}`;
  if (f.isList) return `[${result}${!forceOptional && isRequired(f) ? "!]!" : "]"}`;
  return `${result}${!forceOptional && isRequired(f) ? "!" : ""}`;
}

export function validationBlocks(documentation?: string): string {
  // @see https://regex101.com/r/7Y548N/1
  const matches = documentation?.match(/@Validate.[a-zA-Z]+\([a-zA-Z ,()'"[\]]+/g);
  return (matches ?? [])
    .map(m => m.split("@Validate.")[1])
    .map(m => `@${m}`)
    .join("\n");
}

export function importValidations(model: DMMF.Model) {
  const imports = extractValidations(model);
  return imports ? `import { ${imports} } from "class-validator";` : "";
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
  return "";
}

type ImportRelationsArgs = {
  prefix: string;
  filterOutRelations?: boolean;
};

export function importRelations(model: DMMF.Model, args: ImportRelationsArgs): string {
  const { filterOutRelations = false, prefix } = args;
  let fields = model.fields.filter(f => f.kind == "object");
  if (filterOutRelations) fields = fields.filter(f => !f.relationName);
  return fields.map(f => `import { ${importName(f, { prefix })} } from "./${f.type}.model";`).join("\n");
}

type GraphqlFieldsArgs = {
  prefix: string;
};

export function graphqlFields(f: DMMF.Field, { prefix }: GraphqlFieldsArgs) {
  return `@Field(() => ${f.isId ? "ID" : graphqlType(f, { prefix })}, { nullable: ${!isRequired(f)} })`;
}

export const importNestjsGraphql = (model: DMMF.Model) => `
  import {
    ObjectType,
    Field,
    ${needsIDField(model) ? "ID," : ""}
    ${needsHideField(model) ? "HideField," : ""}
    ${extraNestjsGraphqlFields(model)}
  } from "@nestjs/graphql";
`;

type CreateClassFieldArgs = {
  prefix: string;
};

export function createClassField(field: DMMF.Field, args: CreateClassFieldArgs) {
  const { prefix } = args;
  // const autoInc = isAutoIncrement(field);
  let result = "";
  if (isReadOnly(field)) result += "readonly ";
  result += field.name;
  if (isRequired(field)) result += ":";
  else result += ": null | ";
  result += type(field, { prefix });
  return result;
}
