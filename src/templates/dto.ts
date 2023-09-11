import { DMMF } from "@prisma/generator-helper";
import { AUTO_GENERATED_MESSAGE, ModelOptions } from "../constants";
import { transformDMMF } from "../utils/transformDMMF";
import {
  graphqlType,
  importRelations,
  isRequired,
  needsGraphqlJSONImport,
  shouldHide,
  type,
  validationBlocks,
} from "../utils/formatter";
import { formatWithPrettier } from "../utils/writeFile";

type GenerateDtoTemplateArgs = {
  clientPath: string;
  prefix: string;
};

export function xgenerateDtoTemplate(args: GenerateDtoTemplateArgs, model: DMMF.Model) {
  const { clientPath, prefix } = args;

  const createField = (field: DMMF.Field) => {
    const skip = field.isUpdatedAt || field.name === "createdAt";

    if (skip) return "";

    if (field.isId) {
      const required = field.isRequired && !field.hasDefaultValue;
      // @ts-ignore
      return `
          ${validationBlocks(field.documentation)}
          @Field(() => ID, { nullable: ${!required} })  
          ${field.name}${required ? "!" : "?"}: ${type(field, { prefix })}
        `;
    }

    const required = field.name !== "createdAt" && isRequired(field);

    return `
      ${validationBlocks(field.documentation)}
      @Field(() => ${graphqlType(field, { prefix })}, { nullable: ${!required} })  
      ${field.name}${required ? "!" : "?"}: ${type(field, { prefix })}
    `;
  };

  const updateField = (field: DMMF.Field) => {
    if (shouldHide(field.documentation) || field.isUpdatedAt || field.name.startsWith("created")) return "";
    return `
@Field(() => ${
      field.isId
        ? "ID!"
        : graphqlType(field, {
            forceOptional: true,
            prefix,
          })
    }, { nullable: ${!field.isId} })  
${field.name}${field.isId ? "!" : "?"}: ${type(field, { prefix })}
`;
  };

  const whereField = (field: DMMF.Field) => {
    return `
@Field(() => ${
      field.isId
        ? "ID"
        : graphqlType(field, {
            forceOptional: true,
            prefix,
          })
    }, { nullable: true })  
${field.name}?: ${type(field, { prefix })}
`;
  };

  const listEnums = model.fields.filter(f => f.kind == "enum");

  const needsPrismaImport = (model: DMMF.Model) => {
    if (needsGraphqlJSONImport(model)) return true;
    if (listEnums.length > 0) return true;
  };

  return `
    ${
      needsPrismaImport(model)
        ? `import {
      ${needsGraphqlJSONImport(model) ? "Prisma," : ""}
      ${listEnums.map(f => f.type)}
    } from "${clientPath}";`
        : ""
    }
    ${importRelations(model, { filterOutRelations: true, prefix })}
    
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
      .map(updateField)
      .join("")}
    }
    
    @InputType()
    export class ${model.name}WhereInput {
    ${model.fields
      .filter(f => !f.relationName)
      .filter(f => !f.isUpdatedAt)
      .filter(f => !f.name.startsWith("created"))
      .filter(f => !shouldHide(f.documentation))
      .map(whereField)
      .join("")}
    }
    
    @InputType()
    export class ${model.name}PaginatorInput extends PaginatorInputs {
    }
`;
}

export async function generateDtoTemplate(m: ReturnType<typeof transformDMMF>[number], config: ModelOptions) {
  const { clientPath = "@prisma/client", prefix = "" } = config;

  const template = `
    ${AUTO_GENERATED_MESSAGE}
    ${m.imports.graphqlJSONImport ? "import GraphQLJSON from 'graphql-type-json';" : ""}
    ${m.imports.classValidator ? `import { ${m.imports.classValidator} } from "class-validator";` : ""}
    import { 
      Field, 
      InputType, 
      ${m.imports.id ? "ID," : ""} 
      ${m.imports.nestGraphql ? m.imports.nestGraphql : ""} 
    } from "@nestjs/graphql";
    ${m.imports.relations.map(r => `import { ${config.prefix + r.type} } from "./${r.type}.model";`).join("\n")}
    import {
      ${m.imports.graphqlJSONImport ? "Prisma," : ""}
      ${m.name} as Prisma${m.name},
      ${m.imports.enums}
    } from "${clientPath}";
    import { PaginatorInputs } from "./paginator";
    import { ${m.name}Constructor } from "./${m.name}.model";
    
    @InputType()
    export class ${m.name}CreateInput implements ${m.name}Constructor {
    ${m.fields
      .filter(f => f.canCreate)
      .map(
        f => `
          ${f.validationBlocks ? f.validationBlocks : ""}
          @Field(() => ${f.isId ? "ID" : f.graphqlType}, { nullable: ${f.isId || !f.isRequired} })  
          ${f.name}${f.isId || !f.isRequired ? "?" : "!"}: ${f.type};
        `,
      )
      .join("\n")}
    }
    
    @InputType()
    export class ${m.name}UpdateInput {
      @Field(() => ID, { nullable: true })  
      ${m.fields.find(f => f.isId)!.name}?: ${m.fields.find(f => f.isId)!.type}
    
    ${m.fields
      .filter(f => f.canUpdate)
      .map(
        f => `
          @Field(() => ${f.graphqlType}, { nullable: ${f.isOptional} })
          ${f.name}${f.isId ? "!" : "?"}: ${f.type}
        `,
      )
      .join("\n")}
    }

    @InputType()
    export class ${m.name}WhereInput {
    ${m.fields
      .filter(f => !f.isRelatedField)
      .filter(f => !f.name.startsWith("created"))
      .filter(f => !f.isHidden)
      .map(
        f => `
          @Field(() => ${f.isId ? "ID" : f.graphqlType}, { nullable: true })  
          ${f.name}?: ${f.type}
        `,
      )
      .join("\n")}
    }

    @InputType()
      export class ${m.name}PaginatorInput extends PaginatorInputs {
    }
  `;

  return await formatWithPrettier(template);
}
