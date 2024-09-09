import { Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
/*

import { Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Schema as MongooSchema } from 'mongoose'; */

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}
  /*
  resolver

  @Mutation(() => User, {
    description: 'Creates a new user',
  })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.createUser(createUserInput);
  }

  @Query(() => [User], {
    name: 'users',
    description: 'Get a list of all users',
  })
  findAll() {
    return this.userService.findAll();
  }

  @Query(() => User, {
    name: 'userById',
    description: 'Retrieves a user with a specific ID',
  })
  getUserById(
    @Args('id', { type: () => String }) id: MongooSchema.Types.ObjectId,
  ) {
    return this.userService.getUserById(id);
  }

  @Mutation(() => User, {
    description: 'Updates a user with a specific ID',
  })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.updateUser(updateUserInput._id, updateUserInput);
  }

  @Mutation(() => User, {
    description: 'Deletes a user with a specific ID',
  })
  removeUser(@Args('id', { type: () => Int }) id: MongooSchema.Types.ObjectId) {
    return this.userService.remove(id);
  }*/
}
