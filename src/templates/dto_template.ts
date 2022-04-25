import { DMMF } from "@prisma/generator-helper";
import {
  addRelatedModelImports,
  graphqlType,
  hide,
  isRequired,
  needsIDField,
  type,
  validationBlocks,
  validationImports,
} from "./model_template";

// @ts-ignore
export const isAutoIncrement = (field: DMMF.Field): boolean => field.default?.name === "autoincrement";

export function generateDtoTemplate(model: DMMF.Model) {
  const createField = (field: DMMF.Field) => {
    const skip = field.isUpdatedAt || field.name === "createdAt";

    if (skip) return "";

    if (field.isId) {
      const required = field.isRequired;
      // @ts-ignore
      return `
          ${validationBlocks(field.documentation)}
          @Field(() => ID, { nullable: ${!required} })  
          ${field.name}${required ? "!" : "?"}: ${type(field)}
        `;
    }

    const required = field.name !== "createdAt" && isRequired(field);

    return `
      ${validationBlocks(field.documentation)}
      @Field(() => ${graphqlType(field)}, { nullable: ${!required} })  
      ${field.name}${required ? "!" : "?"}: ${type(field)}
    `;
  };

  const updateField = (field: DMMF.Field) => {
    if (hide(field.documentation) || field.isUpdatedAt || field.name.startsWith("created")) return "";
    return `
@Field(() => ${field.isId ? "ID!" : graphqlType(field, true)}, { nullable: ${!field.isId} })  
${field.name}${field.isId ? "!" : "?"}: ${type(field)}
`;
  };

  const hasRelatedFields = (f: DMMF.Field) =>
    !model.fields
      .filter(f => f.relationName)
      .map(f => f.name)
      .filter(relation => f.name.startsWith(relation)).length;

  const addEnumImports = (model: DMMF.Model) => {
    const enums = model.fields.filter(f => f.kind == "enum");
    return enums.length
      ? `
import { ${enums.map(f => f.type)} } from "../client";
`
      : "";
  };

  const extraInputs = (model: DMMF.Model) => {
    const inputs: string[] = [];
    model.fields
      .filter(f => !f.isId)
      .filter(f => !f.relationName)
      .filter(f => !f.isUpdatedAt)
      .forEach(f => {
        if (f.type === "Int") inputs.push("Int");
      });
    return [...new Set(inputs)];
  };

  return `
import { 
  Field, 
  InputType, 
  ${needsIDField(model) ? "ID," : ""} 
  ${extraInputs(model)} 
} from "@nestjs/graphql";
${addEnumImports(model)}
${addRelatedModelImports(model, { filterOutRelations: true })}
${validationImports(model)}
import { ${model.name}Constructor } from "./${model.name}.model";
import { PaginatorInputs } from "./paginator";

@InputType()
export class ${model.name}CreateInput implements ${model.name}Constructor {
${model.fields
  .filter(f => !f.relationName)
  .filter(f => !f.isUpdatedAt)
  .map(createField)
  .join("")}
}

@InputType()
export class ${model.name}UpdateInput {
${model.fields
  .filter(f => !f.relationName)
  .filter(f => !f.isUpdatedAt)
  .filter(hasRelatedFields)
  .map(updateField)
  .join("")}
}

@InputType()
export class ${model.name}PaginatorInput extends PaginatorInputs {
}
`;
}
