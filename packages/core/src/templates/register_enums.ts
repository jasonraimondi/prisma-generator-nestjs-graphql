import { DMMF } from "@prisma/generator-helper";

import { AUTO_GENERATED_MESSAGE } from "../constants";

type Data = {
  enums: DMMF.DatamodelEnum[];
};

export const registerEnumsTemplate = (clientPath: string, data: Data) => `
${AUTO_GENERATED_MESSAGE}

import { registerEnumType } from "@nestjs/graphql"; 
import { ${data.enums.map(e => e.name)} } from "${clientPath}";

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
