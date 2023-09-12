import { AUTO_GENERATED_MESSAGE, ModelOptions, MyDMMF } from "../constants";
import { formatWithPrettier } from "../utils/writeFile";

export async function generateDtoTemplate(m: MyDMMF, config: ModelOptions) {
  const idField = m.fields.find(f => f.isId);
  return await formatWithPrettier(`
    ${AUTO_GENERATED_MESSAGE}
    ${m.imports.graphqlJSONImport ? "import GraphQLJSON from 'graphql-type-json';" : ""}
    ${m.imports.classValidator ? `import { ${m.imports.classValidator} } from "class-validator";` : ""}
    import { 
      Field, 
      InputType, 
      ${m.imports.id ? "ID," : ""} 
      ${m.imports.nestGraphql ? m.imports.nestGraphql : ""} 
    } from "@nestjs/graphql";
    import {
      ${m.imports.graphqlJSONImport ? "Prisma," : ""}
      ${m.imports.enums}
    } from "${config.clientPath}";
    import { PaginatorInputs } from "../paginator";
    import { ${m.name}Constructor } from "../models/${m.name}${config.modelFileSuffix}";
    
    @InputType()
    export class ${m.name}CreateInput implements ${m.name}Constructor {
    ${m.fields
      .filter(f => f.canCreate)
      .map(
        f => `
          ${f.validationBlocks ? f.validationBlocks : ""}
          @Field(() => ${f.isId ? "ID" : f.graphqlType}, { nullable: ${!f.isRequired} })  
          ${f.name}${!f.isRequired ? "?" : "!"}: ${f.type};
        `,
      )
      .join("\n")}
    }
    
    @InputType()
    export class ${m.name}UpdateInput {
    ${
      idField
        ? `
      @Field(() => ID, { nullable: true })  
      ${idField.name}?: ${idField.type}
    `
        : ""
    }
    
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
  `);
}
