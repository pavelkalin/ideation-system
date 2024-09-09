


## Description

This is a backend ideation system where users can submit ideas and read them. The core stack is built with Node.js, TypeScript, NestJS, and MongoDB. The API is implemented using GraphQL.

## Brief overview

The application is structured as a single service, where each model is organized into its own dedicated folder, following a modular architecture.
User authentication is implemented using JWT tokens.
The Passport library is used to handle the authentication process.

Guards are applied to API endpoints that require authentication, ensuring secure access to protected resources.
GraphQL Support:
The service exposes the following GraphQL endpoints:

#### User Authentication:

* Sign Up: Allows new users to register.
* Log In: Issues a JWT token upon successful authentication.
* Log Out: Invalidates the user session.

#### Idea Management (CRUD Operations):

* Create: Allows users to create new ideas.
* Read: Retrieves details about existing ideas.
* Update: Enables users to modify their own ideas.
* Delete: Removes an idea from the system.

This architecture ensures a clear separation of concerns, with authentication being handled securely via JWT, and CRUD operations exposed through GraphQL for efficient and flexible API interactions.

## Running the app

```bash
# start service
$ docker-compose up --build

# closing service

$ docker-compose down
```

GraphQL Playground is available by [http://localhost:3000/graphql](http://localhost:3000/graphql)

Postman collection is available in source code [Ideation-system.postman_collection.json](Ideation-system.postman_collection.json)
or via link - https://api.postman.com/collections/11485332-32ee7580-c475-44ab-8515-1f56d0fccc07?access_key=PMAT-01J7C20ZED9BB6F5HFFXPVQ6AC

## Test

To test locally run mongo 

```bash
# create .env file from .env.example
$ cp .env.example .env

# uncomment env variables from .env
$ chmod +x remove_hashes.sh
$ ./remove_hashes.sh .env 

# install dependencies
$ npm ci

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

# create .env file from .env.example
$ cp .env.example .env

# uncomment env variables from .env
$ chmod +x remove_hashes.sh
$ ./remove_hashes.sh .env 

# install dependencies
$ npm ci

# run app in dev mode 
$ npm run start:dev
```