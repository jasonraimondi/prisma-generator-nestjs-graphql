/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { ObjectType, Field, Int } from "@nestjs/graphql";

import { UserRole as PrismaUserRole } from "@prisma/client";

import { BaseRole } from "./Role.model";
import { BaseUser } from "./User.model";

export type UserRoleConstructor = {
  roleId: number;
  userId: string;
  createdAt?: Date | null;
  role?: BaseRole | null;
  user?: BaseUser | null;
};

@ObjectType({ isAbstract: true })
export class BaseUserRole implements PrismaUserRole {
  @Field(() => Int!, { nullable: false })
  readonly roleId: number;

  @Field(() => String!, { nullable: false })
  readonly userId: string;

  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  @Field(() => BaseRole, { nullable: true })
  role: null | BaseRole;

  @Field(() => BaseUser, { nullable: true })
  user: null | BaseUser;

  constructor(model: UserRoleConstructor) {
    this.roleId = model.roleId;
    this.userId = model.userId;
    this.createdAt = model.createdAt ?? new Date();
    this.role = model.role ?? null;
    this.user = model.user ?? null;
  }

  static fromHash(hash: PrismaUserRole): BaseUserRole {
    return new BaseUserRole(hash);
  }

  toHash(): PrismaUserRole {
    const { role, user, ...entity } = this;
    return entity;
  }
}
