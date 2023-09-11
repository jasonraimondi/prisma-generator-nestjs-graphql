import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";

import { transformDMMF } from "../../src/utils/transformDMMF";
import { generateModelTemplate } from "../../src/templates/model";

describe.skip("model template", () => {
  const config = { prefix: "", abstract: true, clientPath: "./client-path" };

  describe("kitchen sink", () => {
    it("success", async () => {
      const dmmf = await getDMMF({
        datamodel: `
          model UuidExample {
            id String @id @default(uuid())
          }
        `,
      });

      const [userModel] = transformDMMF(dmmf, config);
      const modelTemplate = await generateModelTemplate(userModel, config);

      expect(modelTemplate).toMatch(/import { v4 as uuid } from 'uuid';/);
      expect(modelTemplate).toContain("@ObjectType({ isAbstract: true })");
      expect(modelTemplate).toMatch(/export class UuidExample implements PrismaUuidExample/);
    });
  });
});
