import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";

import { transformDMMF } from "../../src/utils/transformDMMF";
import { generateDtoTemplate } from "../../src/templates/dto";

describe("dto template", () => {
  const config = { prefix: "Base", abstract: true, clientPath: "./client-path" };

  describe("with relation", () => {
    it("success", async () => {
      const dmmf = await getDMMF({
        datamodel: `
          model User {
            id             String @id @default(uuid())
            favoriteNumber Int
            posts          Post[]
          }
          model Post {
            id       String @id @default(uuid())
            userId   String
            user     User   @relation(fields: [userId], references: [id])
          }
        `,
      });
      const [userModel] = transformDMMF(dmmf, config);
      const template = await generateDtoTemplate(userModel, config);

      console.log(userModel, template);

      // expect(template).toMatchSnapshot();
    });
  });

  describe.skip("uuid", () => {
    it("success", async () => {
      const dmmf = await getDMMF({
        datamodel: `
          model UuidExample {
            id String @id @default(uuid())
          }
        `,
      });

      const [userModel] = transformDMMF(dmmf, config);
      const modelTemplate = await generateDtoTemplate(userModel, config);

      // expect(modelTemplate).toMatchSnapshot();
    });
  });
});
