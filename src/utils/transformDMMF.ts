import { DMMF } from "@prisma/generator-helper";

export type Options = {
  prefix: string;
};

export function transformDMMF(dmmf: DMMF.Document, options: Options) {
  function shouldHide(f: DMMF.Field) {
    return f.documentation?.includes("@HideField()") || false;
  }

  function importName(f: DMMF.Field) {
    if (f.kind === "object") return `${options.prefix}${f.type}`;
    if (f.kind === "enum") return `(typeof ${f.type})[keyof typeof ${f.type}]`;
    return f.type;
  }

  return dmmf.datamodel.models.map(model => {
    let nestGraphqlImports: string[] = [];
    model.fields
      .filter(f => !f.isId)
      .filter(f => !f.relationName)
      .filter(f => !f.isUpdatedAt)
      .forEach(f => {
        if (f.type === "Int" && !shouldHide(f)) nestGraphqlImports.push("Int");
      });
    nestGraphqlImports = [...new Set(nestGraphqlImports)];

    return {
      // ...model,
      name: model.name,
      nestGraphqlImports,
      needsHideField: model.fields.filter(shouldHide).length > 0,
      needsIDField: model.fields.filter(f => f.isId).length > 0,
      needsCUIDImport: model.fields.filter(f => f.default?.name === "cuid").length > 0,
      needsGraphqlJSONImport: model.fields.filter(f => f.type === "Json").length > 0,
      needsUUIDImport: model.fields.filter(f => f.default?.name === "uuid").length > 0,
      fields: model.fields.map(f => {
        return {
          isHidden: shouldHide(f),
          isRequired: (f.isRequired || f.isId) && !f.relationName,
          isReadOnly: f.isReadOnly || f.isId,
        };
      }),
    };
  });
}
