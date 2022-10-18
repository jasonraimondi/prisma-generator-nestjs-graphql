/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { v4 as uuid } from "uuid";

import { IsEmail, IsDate, MaxDate, IsIP } from "class-validator";

import { ObjectType, Field, ID, HideField } from "@nestjs/graphql";

import { User as PrismaUser } from "@prisma/client";
import { BasePost } from "./Post.model";

export type UserConstructor = {
  id?: string | null;
  email: string;
  passwordHash?: string | null;
  tokenVersion?: number | null;
  lastLoginAt?: Date | null;
  createdIP: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  posts?: BasePost[] | null;
};

@ObjectType()
export class BaseUser implements PrismaUser {
  @Field(() => ID, { nullable: false })
  readonly id: string;

  @IsEmail()
  @Field(() => String!, { nullable: false })
  email: string;

  @HideField()
  passwordHash: null | string;

  @HideField()
  tokenVersion: number;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date, { nullable: true })
  lastLoginAt: null | Date;

  @IsIP()
  @Field(() => String!, { nullable: false })
  createdIP: string;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: null | Date;

  @Field(() => [BasePost], { nullable: true })
  posts: null | BasePost[];

  constructor(model: UserConstructor) {
    this.id = model.id ?? uuid();
    this.email = model.email;
    this.passwordHash = model.passwordHash ?? null;
    this.tokenVersion = model.tokenVersion ?? 0;
    this.lastLoginAt = model.lastLoginAt ?? null;
    this.createdIP = model.createdIP;
    this.createdAt = model.createdAt ?? new Date();
    this.updatedAt = model.updatedAt ?? null;
    this.posts = model.posts ?? null;
  }

  static fromPrisma(hash: PrismaUser): BaseUser {
    return new BaseUser(hash);
  }

  // this method removes all relational fields from the entity, and returns the base PrismaModel
  toPrisma(): PrismaUser {
    const { posts, ...entity } = this;
    return entity;
  }
}

export { PrismaUser };
