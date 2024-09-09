## Description

This is a backend ideation system where users can submit ideas and read them. The core stack is built with Node.js, TypeScript, NestJS, and MongoDB. The API is implemented using GraphQL.

## Brief overview

Application is in one service, where each model is placed into it's own folder.
User authentication is done via JWT tokens using Passport library.
We use guards for API that should be authenticated.
We support GraphQL endpoints for:
* User authentication (sign up, log in, logout).
* Idea CRUD operations (create, read, update, delete).

## Running the app

```bash
# start service
$ docker-compose up --build

# closing service

$ docker-compose down
```

GraphQL Playground is available by http://localhost:3000/graphql

## Test

To test locally run mongo 

```bash
# create .env file from .env.example
$ cp .env.example .env
# run mongo
$ docker-compose up mongo
```
then

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Running the app in dev mode

```bash
# start service
$ docker-compose up mongo

# if .env file is not created => create it
$ cp .env.example .env

# install dependencies
$ npm i

# run app in dev mode 
$ npm run start:dev
```