import { CreateIdeaInput } from './create-idea.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateIdeaInput extends PartialType(CreateIdeaInput) {
  @Field(() => Int)
  id: number;
}
