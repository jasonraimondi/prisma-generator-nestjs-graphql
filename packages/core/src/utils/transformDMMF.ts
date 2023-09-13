import { DMMF } from "@prisma/generator-helper";

import { getDefaultValue, graphqlField, graphqlType, type } from "./formatter";
import { ModelOptions } from "../constants";

export function checkIsID(f: DMMF.Field): boolean {
  return f.isId;
}

export function checkTypeJson(f: DMMF.Field): boolean {
  return f.type === "Json";
}

export function checkCUID(f: DMMF.Field): boolean {
  return typeof f.default === "object" && "name" in f.default && f.default.name === "cuid";
}

export function checkUUID(f: DMMF.Field): boolean {
  return typeof f.default === "object" && "name" in f.default && f.default.name === "uuid";
}

export function checkAutoIncrement(f: DMMF.Field): boolean {
  return typeof f.default === "object" && "name" in f.default && f.default.name === "autoincrement";
}

export function checkRequired(f: DMMF.Field): boolean {
  return (f.isRequired || f.isId) && !f.relationName;
}

export function checkReadOnly(f: DMMF.Field): boolean {
  return f.isReadOnly || f.isId;
}

export function checkOptional(f: DMMF.Field): boolean {
  return f.isList || !f.isRequired || f.hasDefaultValue || Boolean(f.relationName);
}

export function checkHidden(f: DMMF.Field): boolean {
  return f.documentation?.includes("@HideField()") ?? false;
}

export function checkCanCreate(f: DMMF.Field): boolean {
  return !(f.relationName || f.isUpdatedAt);
}

export function checkCanUpdate(f: DMMF.Field): boolean {
  return !(checkHidden(f) || f.isReadOnly || f.isId || f.relationName || f.isUpdatedAt || f.name.startsWith("created"));
}

export function extractValidations(model: DMMF.Model) {
  let validations: string[] = [];
  const regex = /@Validate.[a-zA-Z]+/g;
  model.fields
    .map(f => f.documentation?.match(regex) ?? [])
    .forEach(s => s.forEach(t => validations.push(t.replace("@Validate.", ""))));
  validations = [...new Set(validations)];
  return validations.length ? validations : false;
}

export function extractNestGraphql(model: DMMF.Model) {
  let nestGraphqlImports: string[] = [];
  model.fields
    // .filter(f => !f.isId)
    .filter(f => !f.relationName)
    .filter(f => !f.isUpdatedAt)
    .forEach(f => {
      if (f.type === "Int") nestGraphqlImports.push("Int");
    });
  nestGraphqlImports = [...new Set(nestGraphqlImports)];
  return nestGraphqlImports.length ? nestGraphqlImports : false;
}

export function transformDMMF(dmmf: DMMF.Document, options: ModelOptions) {
  return dmmf.datamodel.models.map(model => {
    return {
      name: model.name,
      fullName: options.modelPrefix + model.name + options.modelSuffix,
      imports: {
        id: model.fields.some(checkIsID),
        cuid: model.fields.some(checkCUID),
        uuid: model.fields.some(checkUUID),
        graphqlJSONImport: model.fields.some(checkTypeJson),
        hideField: model.fields.some(checkHidden),
        nestGraphql: extractNestGraphql(model),
        classValidator: extractValidations(model),
        enums: model.fields.filter(f => f.kind == "enum").map(f => f.type),
        relations: model.fields
          .filter(f => f.relationName)
          .map(f => ({
            name: f.name,
            type: f.type,
          })),
      },
      fields: model.fields.map(f => {
        return {
          name: f.name,
          kind: f.kind,
          type: type(f, options),
          graphqlType: graphqlType(f, options),
          graphqlField: graphqlField(f, options),
          defaultValue: getDefaultValue(f),
          isId: f.isId,
          isHidden: checkHidden(f),
          isRequired: checkRequired(f),
          isReadOnly: checkReadOnly(f),
          isAutoIncrement: checkAutoIncrement(f),
          isUUID: checkUUID(f),
          isCUID: checkCUID(f),
          isOptional: checkOptional(f),
          isRelatedField: Boolean(f.relationName),
          canCreate: checkCanCreate(f),
          canUpdate: checkCanUpdate(f),

          validationBlocks: f.documentation
            // @see https://regex101.com/r/7Y548N/1
            ?.match(/@Validate.[a-zA-Z]+\([a-zA-Z ,()'"[\]]+/g)
            ?.map(m => m.split("@Validate.")[1])
            .map(m => `@${m}`)
            .join("\n") as string | undefined,
        };
      }),
    };
  });
}
