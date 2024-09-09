import { InputType, Field } from '@nestjs/graphql';
import { IsMongoId, IsString, MaxLength, MinLength } from 'class-validator';
import { Schema as MongooSchema } from 'mongoose';

@InputType()
export class CreateIdeaInput {
  @Field(() => String, { description: 'Title of the idea' })
  @IsString()
  @MinLength(3, { message: 'Title is too short' })
  @MaxLength(25, { message: 'Title is too long' })
  title: string;

  @Field(() => String, { description: 'Description of the idea' })
  @IsString()
  @MinLength(10, { message: 'Description is too short' })
  @MaxLength(255, { message: 'Description is too long' })
  description: string;
}
