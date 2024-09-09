import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'The response object after a user logs out' })
export class LogoutResponse {
  @Field(() => String, { description: 'Success message after logout' })
  message: string;
}
