import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/app/user/entities/user.entity';

@ObjectType({ description: 'This represents the response of the login API' })
export class LoginUserResponse {
  @Field(() => User, { description: 'Authenticated user details' })
  user: User;

  @Field({ description: 'JWT token for the authenticated user' })
  token: string;
}
