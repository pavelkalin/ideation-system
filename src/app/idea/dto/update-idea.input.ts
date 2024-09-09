import { CreateIdeaInput } from './create-idea.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { Schema as MongooSchema } from 'mongoose';
import { IsMongoId } from 'class-validator';

@InputType()
export class UpdateIdeaInput extends PartialType(CreateIdeaInput) {
  @Field(() => String)
  @IsMongoId()
  _id: MongooSchema.Types.ObjectId;
}
