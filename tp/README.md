# SE 1 - Project

- [Stack](#stack)
- [How to run](#how-to-run)
- [How to run tests](#how-to-run-tests)

## Stack

- [TypeScript](https://www.typescriptlang.org/)
- [TypeORM](https://typeorm.io/#/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Mocha](https://mochajs.org/)

## How to run

- Install [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)
- Run `docker compose up -d` in the root directory of the project
- Run `npm run dev` in the root directory of the project to start the server

## How to run tests

We're using Mocha and a specific database `postgres-test` created in the docker-compose file for the tests.

- Run `docker compose up -d` in the root directory of the project
- Run `npm run test` in the root directory of the project

## Exercises

- [Exercise 2](./exercises/Exercise2.md)
- [Exercise 4](./exercises/Exercise4.md)
