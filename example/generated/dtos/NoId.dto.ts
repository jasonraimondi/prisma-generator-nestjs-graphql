/////////////////////////////////////
// THIS FILE WAS AUTO GENERATED
// DO NOT EDIT THIS FILE DIRECTLY
/////////////////////////////////////

import { Field, InputType, ID } from "@nestjs/graphql";
import {} from "@prisma/client";
import { PaginatorInputs } from "../paginator";
import { NoIdConstructor } from "../models/NoId.model";

@InputType()
export class NoIdCreateInput implements NoIdConstructor {
  @Field(() => ID, { nullable: false })
  declare userId: string;

  @Field(() => Date!, { nullable: false })
  declare createdAt: Date;
}

@InputType()
export class NoIdUpdateInput {
  @Field(() => ID, { nullable: true })
  userId?: string;
}

@InputType()
export class NoIdWhereInput {
  @Field(() => ID, { nullable: true })
  userId?: string;
}

@InputType()
export class NoIdPaginatorInput extends PaginatorInputs {}
