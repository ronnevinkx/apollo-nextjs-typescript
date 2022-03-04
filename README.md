# Next.js with Apollo Client, TypeScript and Apollo Server

Starter package for Next.js and Apollo, written in TypeScript.

## Backend Technologies

Project name: **myblog-server**

| Technology    | Purpose                                   |
| ------------- | ----------------------------------------- |
| Node.js       | JavaScript runtime environment            |
| TypeScript    | Programming language                      |
| Apollo Server | Creating GraphQL endpoint                 |
| PostgreSQL    | Database (pg needed to create migrations) |
| TypeORM       | Interacting with databse                  |
| TypeGraphQL   | Define GraphQL schema and resolvers       |
| GraphQL       | Needed to create migrations               |
| Dotenv-safe   | Making sure all .env variables are there  |
| gen-env-types | Generate .env variable types              |

### Notes

-   Make sure GraphQL version works with TypeGraphQL (15.8.0, not 16).
-   Local playground was remove in Apollo Server v2, with v3, use the online [Apollo Studio Explorer](https://studio.apollographql.com/sandbox/explorer)
-   Had to install `class-validator` and `@types/validator` to get rid of some TS error on server

## Backend Steps

1. Create project, tsconfig, ormconfig, Postgres database, add dependencies
2. Create entities
3. Generate migrations:
   Initial db setup: `npx typeorm migration:generate -n Initial`
   To insert some fake posts: `npx typeorm migration:generate -n FakePosts`
4. Run migrations
5. Set up Express, dotenv-safe
6. Set up Apollo Server v3, resolvers

## Updating the database

1.  After each entity adjustment, create a new migration file with a descriptive name with `npx typeorm migration:generate -n AddKeywordsColumnToPost`
2.  Get rid of migration files in `dist/migrations`
3.  Put the generated file in the `migrations` folder

This should automatically run migrations on the server.

Otherwise, run migrations manually: `./node_modules/.bin/typeorm migration:run`

To revert a migration: `./node_modules/.bin/typeorm migration:revert`

## Frontend Technologies

Project name: **myblog-client**

| Technology             | Purpose                                      |
| ---------------------- | -------------------------------------------- |
| Next.js                | React framework for SSG and SSR              |
| TypeScript             | Programming language                         |
| Apollo Client          | GraphQL client                               |
| GraphQL Code Generator | Generates typed hooks for GraphQL operations |

## Local Development

Start local development by running these scripts:

1. Backend, TypeScript watch and compile: `yarn watch`
2. Backend, run in development: `yarn dev`
3. Frontend, run in development: `yarn dev`

## Building the frontend app

-   Run `yarn build`
-   The folder `/web/.next/server/pages/post` should now have HTML files for all posts retrieved via `getStaticPaths`

## Notes

-   Bug: when load more, click on item, use back button, then 6 are displayed but load more button is visible when it shouldn't be
