import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from '../user/dto/create-user.input';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { LoginUserResponse } from './dto/login-response';
import { LogoutResponse } from './dto/logout-response';
import { LoginUserInput } from './dto/login-user.input';
import { GqlAuthGuard } from './gql-auth.guard';
import { CommonService } from '../common/common.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Resolver(() => User)
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private commonService: CommonService,
  ) {}

  @Mutation(() => LoginUserResponse, {
    description: 'Authenticate a user and retrieve JWT token',
  })
  @UseGuards(GqlAuthGuard)
  login(
    @Args('loginUserInput', { description: 'Expected user input for login' })
    loginUserInput: LoginUserInput,
    @Context() context: any,
  ) {
    return this.authService.login(context.user);
  }

  @Mutation(() => User, { description: 'Sign up a new user' })
  signup(
    @Args('signupInput', { description: 'Expected user input for signup' })
    signupInput: CreateUserInput,
  ) {
    return this.authService.signup(signupInput);
  }

  @Query(() => LogoutResponse, { description: 'Log out a user' })
  @UseGuards(JwtAuthGuard)
  logout(@Context() context: any) {
    const token = this.commonService.extractJwtTokenFromRequest(context.req);
    if (this.authService.logout(token)) {
      return { message: 'You were successfully logged out' };
    }
  }
}
