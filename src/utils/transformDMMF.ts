import { DMMF } from "@prisma/generator-helper";
import { createClassField, getDefaultValue, graphqlFields, type } from "../templates/model_template";

export const checkIsID = (f: DMMF.Field) => f.isId;
export const checkTypeJson = (f: DMMF.Field) => f.type === "Json";
export const checkCUID = (f: DMMF.Field) =>
  typeof f.default === "object" && "name" in f.default && f.default.name === "cuid";
export const checkUUID = (f: DMMF.Field) =>
  typeof f.default === "object" && "name" in f.default && f.default.name === "uuid";
export const checkAutoIncrement = (f: DMMF.Field) =>
  typeof f.default === "object" && "name" in f.default && f.default.name === "autoincrement";
export const checkRequired = (f: DMMF.Field) => (f.isRequired || f.isId) && !f.relationName;
export const checkReadOnly = (f: DMMF.Field) => f.isReadOnly || f.isId;
export const checkOptional = (f: DMMF.Field) =>
  f.isList || !f.isRequired || f.hasDefaultValue || Boolean(f.relationName);
export const checkHidden = (f: DMMF.Field) => f.documentation?.includes("@HideField()") ?? false;

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
  const hideField = (f: DMMF.Field) => f.documentation?.includes("@HideField()") ?? false;
  let nestGraphqlImports: string[] = [];
  model.fields
    .filter(f => !f.isId)
    .filter(f => !f.relationName)
    .filter(f => !f.isUpdatedAt)
    .forEach(f => {
      if (f.type === "Int" && !hideField(f)) nestGraphqlImports.push("Int");
    });
  nestGraphqlImports = [...new Set(nestGraphqlImports)];
  return nestGraphqlImports.length ? nestGraphqlImports : false;
}

export type Options = {
  prefix: string;
};

export function transformDMMF(dmmf: DMMF.Document, options: Options) {
  return dmmf.datamodel.models.map(model => {
    return {
      // ...model,
      name: model.name,
      // importNestjsGraphql: importNestjsGraphql(model),
      // nestGraphqlImports,
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
          .filter(f => f.kind == "object")
          .filter(f => f.relationName)
          .map(f => ({
            name: f.name,
            type: f.type,
          })),
      },
      fields: model.fields.map(f => {
        console.log(f.default);
        return {
          name: f.name,
          kind: f.kind,
          classSomething: createClassField(f, { prefix: options.prefix }),
          type: type(f, { prefix: options.prefix }),
          graphqlFields: graphqlFields(f, { prefix: options.prefix }),
          defaultValue: getDefaultValue(f),
          isHidden: checkHidden(f),
          isRequired: checkRequired(f),
          isReadOnly: checkReadOnly(f),
          isAutoIncrement: checkAutoIncrement(f),
          isUUID: checkUUID(f),
          isCUID: checkCUID(f),
          isOptional: checkOptional(f),
        };
      }),
    };
  });
}
