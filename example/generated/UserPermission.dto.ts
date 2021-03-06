/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { Field, InputType, Int } from "@nestjs/graphql";

import { UserPermissionConstructor } from "./UserPermission.model";
import { PaginatorInputs } from "./paginator";

@InputType()
export class UserPermissionCreateInput implements UserPermissionConstructor {
  @Field(() => Int!, { nullable: false })
  permissionId!: number;

  @Field(() => String!, { nullable: false })
  userId!: string;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}

@InputType()
export class UserPermissionUpdateInput {}

@InputType()
export class UserPermissionWhereInput {
  @Field(() => Int, { nullable: true })
  permissionId?: number;

  @Field(() => String, { nullable: true })
  userId?: string;

  @Field(() => Int, { nullable: true })
  roleId?: number;
}

@InputType()
export class UserPermissionPaginatorInput extends PaginatorInputs {}
