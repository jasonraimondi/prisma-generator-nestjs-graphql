import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";

import { transformDMMF } from "../../src/utils/transformDMMF";
import { generateModelTemplate } from "../../src/templates/model";
import { registerEnumsTemplate } from "../../src/templates/register_enums";

describe("register enums templater", () => {
  const config = { prefix: "", abstract: true, clientPath: "./client-path" };

  it("registers enums", async () => {
    const dmmf = await getDMMF({
      datamodel: `
        enum Tag {
          blue
          red
        }
        enum Category {
          fun
          boring
          misc
        }
      `,
    });
    const enums = dmmf.datamodel.enums;

    const modelTemplate = await registerEnumsTemplate(config.clientPath, { enums });

    expect(modelTemplate).toMatchSnapshot();
  });
});
