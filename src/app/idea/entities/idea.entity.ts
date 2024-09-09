import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Idea {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
