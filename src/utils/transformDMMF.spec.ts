import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";
import { transformDMMF } from "./transformDMMF";

describe("transformDMMF", () => {
  const datamodelString = `
    model UuidExample {
      id String @id @default(uuid())
    }
  `;

  it("todo update this", async () => {
    const dmmf = await getDMMF({ datamodel: datamodelString });

    const [uuidModel] = transformDMMF(dmmf, { prefix: "" });

    console.log(uuidModel);

    expect(uuidModel.needsIDField).toBeTruthy();
    expect(uuidModel.needsUUIDImport).toBeTruthy();
    expect(uuidModel.needsCUIDImport).toBeFalsy();
    expect(uuidModel.needsHideField).toBeFalsy();
    expect(uuidModel.fields[0].isReadOnly).toBeTruthy();
    expect(uuidModel.fields[0].isRequired).toBeTruthy();
    expect(uuidModel.fields[0].isHidden).toBeFalsy();
  });
});
