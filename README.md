# @jmondi/prisma-generator-nestjs-graphql

Generate @nestjs/graphql entities and create/update inputs

## Install

```bash
pnpm add @jmondi/prisma-generator-nestjs-graphql
```

## Usage

```prisma
generator custom_generator {
  provider   = "generate-nestjs-models"
  clientPath = "@prisma/client"
  output     = "../generated"
  prefix     = "Base"
  abstract   = false
  compileJs  = false
}
```

You can also run the generator directly

```prisma
generator custom_generator {
  provider   = "ts-node node_modules/@jmondi/prisma-generator-nestjs-graphql/src/generator.ts"
  ...
}
```

See the [generated examples](example/generated) for sample output.

## Why?

The special sauce here is the [type-safe constructors](https://github.com/jasonraimondi/prisma-generator-nestjs-graphql/blob/main/example/generated/User.model.ts).

```typescript
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
```

Create your own entities by extending the generated base entities.

```typescript
export class User extends BaseUser {}
```

Extend your custom entities with additional fields.

```typescript
export abstract class UserTokenEntity extends BaseUserToken {
  @Field(() => User, { nullable: true })
  user!: null | User;

  constructor(props: UserTokenConstructor) {
    props.user = props.user ? new User(props.user) : undefined;
    super(props);
  }
}
```

## Debug?

```
 DEBUG=* pnpm prisma generate
```
