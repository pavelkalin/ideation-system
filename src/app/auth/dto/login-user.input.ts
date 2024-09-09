import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType({ description: 'Input type for the user login data' })
export class LoginUserInput {
  @Field(() => String, { description: 'Username of the user' })
  @IsString()
  username: string;

  @Field(() => String, { description: 'Password of the user' })
  @IsString()
  password: string;
}
