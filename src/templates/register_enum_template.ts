import { DMMF } from "@prisma/generator-helper";

type Data = {
  enums: DMMF.DatamodelEnum[];
};

export const registerEnumsTemplate = (data: Data) => `
import { registerEnumType } from "@nestjs/graphql"; 
import { ${data.enums.map(e => e.name)} } from "../../client";

export function registerEnums() {
  ${data.enums
    .map(
      e => `registerEnumType(${e.name}, {
    name: '${e.name}',
  });`,
    )
    .join("")}
}
`;
