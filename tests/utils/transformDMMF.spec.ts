import { describe, it, expect } from "vitest";
import { getDMMF } from "@prisma/internals";
import { transformDMMF } from "../../src/utils/transformDMMF";
import { TESTING_OPTIONS } from "../helpers";

describe("transformDMMF", () => {
  const config = TESTING_OPTIONS;

  describe("kitchen sink", () => {
    const datamodelString = `
      model User {
        id             String    @id @default(uuid())
        /// @Validate.IsEmail()
        email          String    @unique 
        /// @HideField()
        passwordHash   String?
        role           Role      @default(USER)
        favoriteNumber Int       @default(0)
        /// @Validate.IsIP()
        createdIP      String   
        /// @Validate.IsDate() @Validate.MaxDate(new Date())
        createdAt      DateTime  @default(now())
        updatedAt      DateTime? @updatedAt
        
        posts          Post[]
        comments       Comment[]
      }
      
      enum Role {
        USER
        ADMIN
      }
      
      model Post {
        id       Int       @id @default(autoincrement())
        userId   String
        user     User      @relation(fields: [userId], references: [id])
      }
      
      model Comment {
        id       Int       @id @default(autoincrement())
        userId   String
        user     User      @relation(fields: [userId], references: [id])
      }
    `;

    it("success", async () => {
      const dmmf = await getDMMF({ datamodel: datamodelString });

      const [userModel] = transformDMMF(dmmf, config);

      expect(userModel.imports.id).toBe(true);
      expect(userModel.imports.hideField).toBe(true);
      expect(userModel.imports.uuid).toBe(true);
      expect(userModel.imports.cuid).toBe(false);
      expect(userModel.imports.classValidator).toStrictEqual(["IsEmail", "IsIP", "IsDate", "MaxDate"]);
      expect(userModel.imports.enums).toStrictEqual(["Role"]);
      expect(userModel.imports.relations).toStrictEqual([
        { name: "posts", type: "Post" },
        { name: "comments", type: "Comment" },
      ]);

      expect(userModel.fields[0].name).toBe("id");
      expect(userModel.fields[0].isReadOnly).toBe(true);
      expect(userModel.fields[0].isRequired).toBe(true);
      expect(userModel.fields[0].isHidden).toBe(false);
    });
  });

  describe("uuid", () => {
    const datamodelString = `
      model UuidExample {
        /// @HideField()
        id String @id @default(uuid())
      }
    `;

    it("todo update this", async () => {
      const dmmf = await getDMMF({ datamodel: datamodelString });

      const [uuidModel] = transformDMMF(dmmf, config);

      expect(uuidModel.imports.id).toBe(true);
      expect(uuidModel.imports.uuid).toBe(true);
      expect(uuidModel.imports.cuid).toBe(false);
      expect(uuidModel.imports.hideField).toBe(true);
      expect(uuidModel.fields[0].isReadOnly).toBe(true);
      expect(uuidModel.fields[0].isRequired).toBe(true);
      expect(uuidModel.fields[0].isHidden).toBe(true);
    });
  });
});
