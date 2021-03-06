/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { ObjectType, Field, ID } from "@nestjs/graphql";

import { CUID as PrismaCUID } from "@prisma/client";

export { PrismaCUID };

export type CUIDConstructor = {
  id: string;
};

@ObjectType({ isAbstract: true })
export class BaseCUID implements PrismaCUID {
  @Field(() => ID, { nullable: false })
  readonly id: string;

  constructor(model: CUIDConstructor) {
    this.id = model.id;
  }

  static fromPrisma(hash: PrismaCUID): BaseCUID {
    return new BaseCUID(hash);
  }

  toPrisma(): PrismaCUID {
    const { ...entity } = this;
    return entity;
  }
}
