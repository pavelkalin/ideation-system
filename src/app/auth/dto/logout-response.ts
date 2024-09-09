import { Field, ObjectType } from '@nestjs/graphql';
import { User } from 'src/app/user/entities/user.entity';

@ObjectType()
export class LoginUserResponse {
  @Field(() => User)
  user: User;

  @Field()
  authToken: string;
}

@ObjectType()
class LogoutResponse {
  @Field(() => String)
  message: string;
}