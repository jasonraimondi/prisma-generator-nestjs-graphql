/////////////////////////////////////
// DO NOT EDIT THIS FILE DIRECTLY,
// THIS FILE WAS AUTO GENERATED.
/////////////////////////////////////

import { v4 as uuid } from "uuid";

import { ObjectType, Field, ID } from "@nestjs/graphql";

import { Post as PrismaPost, Category } from "@prisma/client";
import { BaseUser } from "./User.model";

export { PrismaPost };

export type PostConstructor = {
  id: string;
  category: keyof typeof Category;
  body: string;
  userId: string;
  user?: BaseUser | null;
};

@ObjectType({ isAbstract: true })
export class BasePost implements PrismaPost {
  @Field(() => ID, { nullable: false })
  readonly id: string;

  @Field(() => Category!, { nullable: false })
  category: keyof typeof Category;

  @Field(() => String!, { nullable: false })
  body: string;

  @Field(() => String!, { nullable: false })
  readonly userId: string;

  @Field(() => BaseUser, { nullable: true })
  user: null | BaseUser;

  constructor(model: PostConstructor) {
    this.id = model.id ?? uuid();
    this.category = model.category;
    this.body = model.body;
    this.userId = model.userId;
    this.user = model.user ?? null;
  }

  static fromPrisma(hash: PrismaPost): BasePost {
    return new BasePost(hash);
  }

  toPrisma(): PrismaPost {
    const { user, ...entity } = this;
    return entity;
  }
}
