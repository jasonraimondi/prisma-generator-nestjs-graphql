import { transformDMMF } from "../utils/transformDMMF";
import { AUTO_GENERATED_MESSAGE, ModelOptions } from "../constants";
import { formatWithPrettier } from "../utils/writeFile";

export async function generateModelTemplate(model: ReturnType<typeof transformDMMF>[number], config: ModelOptions) {
  const { clientPath = "@prisma/client", prefix = "", abstract = true } = config;

  const template = `
    ${AUTO_GENERATED_MESSAGE}
    ${model.imports.uuid ? "import { v4 as uuid } from 'uuid';" : ""}
    ${model.imports.cuid ? "import cuid from 'cuid';" : ""}
    ${model.imports.graphqlJSONImport ? "import GraphQLJSON from 'graphql-type-json';" : ""}
    ${model.imports.classValidator ? `import { ${model.imports.classValidator} } from "class-validator";` : ""}
    import {
      ObjectType,
      Field,
      ${model.imports.id ? "ID," : ""}
      ${model.imports.hideField ? "HideField," : ""}
      ${model.imports.nestGraphql ? model.imports.nestGraphql : ""}
    } from "@nestjs/graphql";
    import {
      ${model.imports.graphqlJSONImport ? "Prisma," : ""}
      ${model.name} as Prisma${model.name},
      ${model.imports.enums}
    } from "${clientPath}";
    ${model.imports.relations.map(r => `import { ${prefix + r.type} } from "./${r.type}.model";`).join("\n")}
    
    export type ${model.name}Constructor = {
      ${model.fields
        .map(f => `${f.name}${f.isOptional ? "?" : ""}: ${f.type}${f.isOptional ? " | null" : ""}`)
        .join("\n")}
    }
    
    @ObjectType(${abstract ? "{ isAbstract: true }" : ""})
    export class ${prefix}${model.name} implements Prisma${model.name} {
      ${model.fields
        .map(
          f => `
         ${f.isHidden ? "@HideField()" : f.graphqlField}
         ${f.isReadOnly ? "readonly " : ""}${f.name}${f.isRequired ? ":" : ": null |"} ${f.type};
      `,
        )
        .join("\n")}
    
      constructor(model: ${model.name}Constructor) {
        ${model.fields.map(f => `this.${f.name} = model.${f.name}${f.defaultValue ? f.defaultValue : ""};`).join("\n")}
      }
     
      static fromPrisma(data: Prisma${model.name}): ${prefix}${model.name} {
        return new ${prefix}${model.name}(data);
      }
      
      // this method removes all relational fields from the entity, and returns the base PrismaModel
      toPrisma(): Prisma${model.name} {
        const { ${
          model.imports.relations.length ? model.imports.relations.map(r => r.name) + "," : ""
        } ...entity } = this;
        return entity;
    }
  }
   
  export { Prisma${model.name} };
  `;

  return await formatWithPrettier(template);
}
