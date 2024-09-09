import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateIdeaInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
