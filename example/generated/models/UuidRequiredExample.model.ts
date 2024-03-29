/////////////////////////////////////
// THIS FILE WAS AUTO GENERATED
// DO NOT EDIT THIS FILE DIRECTLY
/////////////////////////////////////

import { ObjectType, Field, ID } from "@nestjs/graphql";
import { UuidRequiredExample as PrismaUuidRequiredExample } from "@prisma/client";

export type UuidRequiredExampleConstructor = {
  id: string;
};

@ObjectType({ isAbstract: true })
export class BaseUuidRequiredExample implements PrismaUuidRequiredExample {
  @Field(() => ID, { nullable: false })
  readonly id: string;

  constructor(model: UuidRequiredExampleConstructor) {
    this.id = model.id;
  }

  static fromPrisma(data: PrismaUuidRequiredExample): BaseUuidRequiredExample {
    return new BaseUuidRequiredExample(data);
  }

  /**
   * Removes all relational fields from the model
   * so you can use it to create or update a record of this model
   * @returns PrismaUuidRequiredExample
   */
  toPrisma(): PrismaUuidRequiredExample {
    const { ...entity } = this;
    return entity;
  }
}

export { PrismaUuidRequiredExample };
