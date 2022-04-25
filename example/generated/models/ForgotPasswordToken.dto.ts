/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { Field, InputType, ID } from "@nestjs/graphql";

import { ForgotPasswordTokenConstructor } from "./ForgotPasswordToken.model";
import { PaginatorInputs } from "./paginator";

@InputType()
export class ForgotPasswordTokenCreateInput
  implements ForgotPasswordTokenConstructor
{
  @Field(() => ID, { nullable: false })
  id!: string;

  @Field(() => Date!, { nullable: false })
  expiresAt!: Date;

  @Field(() => String!, { nullable: false })
  userId!: string;
}

@InputType()
export class ForgotPasswordTokenUpdateInput {
  @Field(() => ID!, { nullable: false })
  id!: string;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date;
}

@InputType()
export class ForgotPasswordTokenPaginatorInput extends PaginatorInputs {}
