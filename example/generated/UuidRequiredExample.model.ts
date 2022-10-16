/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { ObjectType, Field, ID } from "@nestjs/graphql";

import { UuidRequiredExample as PrismaUuidRequiredExample } from "@prisma/client";

export { PrismaUuidRequiredExample };

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

  static fromPrisma(hash: PrismaUuidRequiredExample): BaseUuidRequiredExample {
    return new BaseUuidRequiredExample(hash);
  }

  toPrisma(): PrismaUuidRequiredExample {
    const { ...entity } = this;
    return entity;
  }
}