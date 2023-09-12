import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";

import { transformDMMF } from "../../src/utils/transformDMMF";
import { generateModelTemplate } from "../../src/templates/model";
import { TESTING_OPTIONS } from "../helpers";

describe("model templater", () => {
  const config = TESTING_OPTIONS;

  it("with json", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id      Int @id
            jsonCol Json
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });

  it("with autoincrement", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id Int @id @default(autoincrement())
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });

  it("with uuid", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id String @id @default(uuid())
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });

  it("with cuid", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id String @id @default(cuid())
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });

  it("with integer", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id             String @id
            favoriteNumber Int
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });

  it("with relation", async () => {
    const dmmf = await getDMMF({
      datamodel: `
          model User {
            id    String @id
            posts Post[]
          }
          model Post {
            id       String @id @default(uuid())
            userId   String
            user     User   @relation(fields: [userId], references: [id])
          }
        `,
    });

    const [userModel] = transformDMMF(dmmf, config);
    const modelTemplate = await generateModelTemplate(userModel, config);

    expect(modelTemplate).toMatchSnapshot();
  });
});
