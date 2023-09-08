import { transformDMMF } from "../utils/transformDMMF";
import { AUTO_GENERATED_MESSAGE } from "../constants/constants";

export type ModelOptions = {
  clientPath?: string;
  prefix?: string;
  abstract?: boolean;
  modelSuffix?: string;
};

export function generateModelTemplate(m: ReturnType<typeof transformDMMF>[number], config: ModelOptions = {}) {
  const { clientPath = "@prisma/client", modelSuffix = ".model", prefix = "", abstract = true } = config;

  return `
    ${AUTO_GENERATED_MESSAGE}
    ${m.imports.uuid ? "import { v4 as uuid } from 'uuid';" : ""}
    ${m.imports.cuid ? "import cuid from 'cuid';" : ""}
    ${m.imports.graphqlJSONImport ? "import GraphQLJSON from 'graphql-type-json';" : ""}
    ${m.imports.classValidator ? `import { ${m.imports.classValidator} } from "class-validator";` : ""}
    import {
      ObjectType,
      Field,
      ${m.imports.id ? "ID," : ""}
      ${m.imports.hideField ? "HideField," : ""}
      ${m.imports.nestGraphql ? m.imports.nestGraphql : ""}
    } from "@nestjs/graphql";
    import {
      ${m.imports.graphqlJSONImport ? "Prisma," : ""}
      ${m.name} as Prisma${m.name},
      ${m.imports.enums}
    } from "${clientPath}";
    ${m.imports.relations.map(r => `import { ${r.type} } from "./${r.type}${modelSuffix}";`).join("\n")}
    
    export type ${m.name}Constructor = {
      ${m.fields.map(f => `${f.name}${f.isOptional ? "?" : ""}: ${f.type}${f.isOptional ? " | null" : ""}`).join("\n")}
    }
    
    @ObjectType(${abstract ? "{ isAbstract: true }" : ""})
    export class ${prefix}${m.name} implements Prisma${m.name} {
    
      ${m.fields
        .map(
          f => `
         ${f.isHidden ? "@HideField()" : f.graphqlFields}
         ${f.isReadOnly ? "readonly " : ""}${f.name}${f.isRequired ? ":" : ": null |"} ${f.type};
      `,
        )
        .join("\n")}
    
      constructor(model: ${m.name}Constructor) {
        ${m.fields.map(f => `this.${f.name} = model.${f.name}${f.defaultValue};`).join("\n")}
      }
     
      static fromPrisma(data: Prisma${m.name}): ${prefix}${m.name} {
        return new ${prefix}${m.name}(data);
      }
      
      // this method removes all relational fields from the entity, and returns the base PrismaModel
      toPrisma(): Prisma${m.name} {
        const { ${m.imports.relations.length ? m.imports.relations.map(r => r.name) + "," : ""} ...entity } = this;
        return entity;
    }
  }
   
  export { Prisma${m.name} };
  `;
}
