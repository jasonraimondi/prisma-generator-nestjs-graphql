# @jmondi/prisma-generator-nestjs-graphql

Generate @nestjs/graphql entities and create/update inputs

## Install

```bash
pnpm add @jmondi/prisma-generator-nestjs-graphql
npm install @jmondi/prisma-generator-nestjs-graphql
yarn add @jmondi/prisma-generator-nestjs-graphql
```

## Usage

```prisma
generator custom_generator {
  provider   = "ts-node node_modules/prisma-generator-nestjs-graphql-strict/src/generator.ts"
  output     = "../generated"
  clientPath = "@prisma/client"
}


model User {
  id                     String                  @id @default(uuid()) @db.Uuid
  /// @Validate.IsEmail()
  email                  String                  @unique @db.VarChar(255)
  /// @HideField()
  passwordHash           String?                 @db.VarChar(255)
  /// @HideField()
  tokenVersion           Int                     @default(0)
  isEmailConfirmed       Boolean                 @default(false)
  firstName              String?                 @db.VarChar(255)
  lastName               String?                 @db.VarChar(255)
  /// @Validate.IsDate() @Validate.MaxDate(new Date())
  lastHeartbeatAt        DateTime?               @db.Timestamp(6)
  /// @Validate.IsDate() @Validate.MaxDate(new Date())
  lastLoginAt            DateTime?               @db.Timestamp(6)
  /// @Validate.IsIP()
  lastLoginIP            String?                 @db.Inet
  /// @Validate.IsIP()
  createdIP              String                  @db.Inet
  /// @Validate.IsDate() @Validate.MaxDate(new Date())
  createdAt              DateTime                @default(now()) @db.Timestamp(6)
  updatedAt              DateTime?               @updatedAt
  emailConfirmationToken EmailConfirmationToken?
  forgotPasswordToken    ForgotPasswordToken?
  /// @HideField()
  providers              UserProvider[]
  /// @HideField()
  permissions            UserPermission[]
  /// @HideField()
  roles                  UserRole[]

  @@index([email])
}
```

Will output:

```typescript
export type UserConstructor = {
  id?: string | null;
  email: string;
  passwordHash?: string | null;
  tokenVersion?: number | null;
  isEmailConfirmed?: boolean | null;
  firstName?: string | null;
  lastName?: string | null;
  lastHeartbeatAt?: Date | null;
  lastLoginAt?: Date | null;
  lastLoginIP?: string | null;
  createdIP: string;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  emailConfirmationToken?: BaseEmailConfirmationToken | null;
  forgotPasswordToken?: BaseForgotPasswordToken | null;
  providers?: BaseUserProvider[] | null;
  permissions?: BaseUserPermission[] | null;
  roles?: BaseUserRole[] | null;
};

@ObjectType({ isAbstract: true })
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

  @Field(() => Boolean!, { nullable: false })
  isEmailConfirmed: boolean;

  @Field(() => String, { nullable: true })
  firstName: null | string;

  @Field(() => String, { nullable: true })
  lastName: null | string;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date, { nullable: true })
  lastHeartbeatAt: null | Date;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date, { nullable: true })
  lastLoginAt: null | Date;

  @IsIP()
  @Field(() => String, { nullable: true })
  lastLoginIP: null | string;

  @IsIP()
  @Field(() => String!, { nullable: false })
  createdIP: string;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date!, { nullable: false })
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  updatedAt: null | Date;

  @Field(() => BaseEmailConfirmationToken, { nullable: true })
  emailConfirmationToken: null | BaseEmailConfirmationToken;

  @Field(() => BaseForgotPasswordToken, { nullable: true })
  forgotPasswordToken: null | BaseForgotPasswordToken;

  @HideField()
  providers: null | BaseUserProvider[];

  @HideField()
  permissions: null | BaseUserPermission[];

  @HideField()
  roles: null | BaseUserRole[];

  constructor(model: UserConstructor) {
    this.id = model.id ?? v4();
    this.email = model.email;
    this.passwordHash = model.passwordHash ?? null;
    this.tokenVersion = model.tokenVersion ?? 0;
    this.isEmailConfirmed = model.isEmailConfirmed ?? false;
    this.firstName = model.firstName ?? null;
    this.lastName = model.lastName ?? null;
    this.lastHeartbeatAt = model.lastHeartbeatAt ?? null;
    this.lastLoginAt = model.lastLoginAt ?? null;
    this.lastLoginIP = model.lastLoginIP ?? null;
    this.createdIP = model.createdIP;
    this.createdAt = model.createdAt ?? new Date();
    this.updatedAt = model.updatedAt ?? null;
    this.emailConfirmationToken = model.emailConfirmationToken ?? null;
    this.forgotPasswordToken = model.forgotPasswordToken ?? null;
    this.providers = model.providers ?? null;
    this.permissions = model.permissions ?? null;
    this.roles = model.roles ?? null;
  }

  static fromHash(hash: PrismaUser): BaseUser {
    return new BaseUser(hash);
  }

  toHash(): PrismaUser {
    const {
      emailConfirmationToken,
      forgotPasswordToken,
      providers,
      permissions,
      roles,
      ...entity
    } = this;
    return entity;
  }
}


@InputType()
export class UserCreateInput implements UserConstructor {
  @Field(() => ID, { nullable: false })
  id!: string;

  @IsEmail()
  @Field(() => String!, { nullable: false })
  email!: string;

  @Field(() => String, { nullable: true })
  passwordHash?: string;

  @Field(() => Int!, { nullable: false })
  tokenVersion!: number;

  @Field(() => Boolean!, { nullable: false })
  isEmailConfirmed!: boolean;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date, { nullable: true })
  lastHeartbeatAt?: Date;

  @IsDate()
  @MaxDate(new Date())
  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;

  @IsIP()
  @Field(() => String, { nullable: true })
  lastLoginIP?: string;

  @IsIP()
  @Field(() => String!, { nullable: false })
  createdIP!: string;
}

@InputType()
export class UserUpdateInput {
  @Field(() => ID!, { nullable: false })
  id!: string;

  @Field(() => String, { nullable: true })
  email?: string;

  @Field(() => Boolean, { nullable: true })
  isEmailConfirmed?: boolean;

  @Field(() => String, { nullable: true })
  firstName?: string;

  @Field(() => String, { nullable: true })
  lastName?: string;

  @Field(() => Date, { nullable: true })
  lastHeartbeatAt?: Date;

  @Field(() => Date, { nullable: true })
  lastLoginAt?: Date;

  @Field(() => String, { nullable: true })
  lastLoginIP?: string;
}

@InputType()
export class UserPaginatorInput extends PaginatorInputs {
}
```

Example repository

```typescript
export class UserRepository {
  constructor(private readonly repository: PrismaService) {
  }

  async listUsers(input: UserPaginatorInput): Promise<UserPaginatorResponse> {
    let users = await this.repository.user.findMany({
      take: input.take,
      skip: input.cursorId ? 1 : undefined,
      cursor: input.cursorId ? { id: input.cursorId } : undefined,
    });
    const result = new UserPaginatorResponse();
    result.data = users.map(b => new User(b));
    return paginatorResponse(input, result);
  }

  async getUser(id: string) {
    return new User(
      await this.repository.user.findUnique({
        rejectOnNotFound: true,
        where: { id },
      }),
    );
  }

  async createUser(input: UserCreateInput) {
    await this.repository.user.create({ data: input });
    return true;
  }

  async updateUser(input: UserUpdateInput) {
    const { id, ...data } = input;
    await this.repository.user.update({ where: { id }, data });
    return true;
  }
}
```

