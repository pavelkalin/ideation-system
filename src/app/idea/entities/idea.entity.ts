import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooSchema } from 'mongoose';
import { User } from '../../user/entities/user.entity';

@ObjectType()
@Schema()
export class Idea {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  // Add user properties
  @Field(() => String)
  @Prop()
  title: string;

  @Field(() => String)
  @Prop()
  description: string;

  @Field(() => User)
  @Prop({ type: MongooSchema.Types.ObjectId, ref: 'User' })
  user: User;
}

@ObjectType()
export class GetIdeasPaginatedResponse {
  @Field(() => [Idea], { nullable: false, defaultValue: [] })
  ideas: Idea[];

  @Field(() => Int, { nullable: false, defaultValue: 0 })
  ideasCount: number;

  @Field(() => String, { nullable: true })
  message?: string;
}

export type IdeaDocument = Idea & Document;
export const IdeaSchema = SchemaFactory.createForClass(Idea);
