/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { ObjectType, Field, ID } from "@nestjs/graphql";

import { Role as PrismaRole } from "@prisma/client";

import { BaseRolePermission } from "./RolePermission.model";
import { BaseUserPermission } from "./UserPermission.model";
import { BaseUserRole } from "./UserRole.model";

export type RoleConstructor = {
  id?: number | null;
  name: string;
  rolePermissions?: BaseRolePermission[] | null;
  userPermissions?: BaseUserPermission[] | null;
  userRole?: BaseUserRole[] | null;
};

@ObjectType({ isAbstract: true })
export class BaseRole implements PrismaRole {
  @Field(() => ID, { nullable: false })
  readonly id: number;

  @Field(() => String!, { nullable: false })
  name: string;

  @Field(() => [BaseRolePermission], { nullable: true })
  rolePermissions: null | BaseRolePermission[];

  @Field(() => [BaseUserPermission], { nullable: true })
  userPermissions: null | BaseUserPermission[];

  @Field(() => [BaseUserRole], { nullable: true })
  userRole: null | BaseUserRole[];

  constructor(model: RoleConstructor) {
    this.id = model.id!;
    this.name = model.name;
    this.rolePermissions = model.rolePermissions ?? null;
    this.userPermissions = model.userPermissions ?? null;
    this.userRole = model.userRole ?? null;
  }

  static fromHash(hash: PrismaRole): BaseRole {
    return new BaseRole(hash);
  }

  toHash(): PrismaRole {
    const { rolePermissions, userPermissions, userRole, ...entity } = this;
    return entity;
  }
}
