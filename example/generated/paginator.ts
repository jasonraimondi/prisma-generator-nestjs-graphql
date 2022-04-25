import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsOptional, Max, Min } from "class-validator";

@InputType({ isAbstract: true })
export abstract class PaginatorInputs {
  @IsOptional()
  @Min(0)
  @Field(() => Int, { nullable: true })
  skip?: number;

  @IsOptional()
  @Min(0)
  @Max(500)
  @Field(() => Int, { nullable: true })
  take: number = 3;

  @Field(() => String, { nullable: true })
  cursorId!: string | null;
}

@ObjectType({ isAbstract: true })
export abstract class PaginatorResponse<T> {
  @Field(() => String, { nullable: true })
  cursorId?: string;

  abstract data: T[];
}
