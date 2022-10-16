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
  provider   = "prisma-nestjs-graphql"
  output     = "../generated"
}
```

If you have a custom prisma client path

```prisma
generator custom_generator {
  provider   = "prisma-nestjs-graphql"
  output     = "../generated"
  clientPath = "@prisma/client"
}
```

You can also run the generator directly

```prisma
generator custom_generator {
  provider   = "ts-node node_modules/@jmondi/prisma-generator-nestjs-graphql/src/generator.ts"
  output     = "../generated"
}
```

See the [generated examples](example/generated) for sample output.
