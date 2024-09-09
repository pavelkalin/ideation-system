import { ObjectType, Field } from '@nestjs/graphql';
import { Document, Schema as MongooSchema } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from './roles.enum';
import { Idea } from '../../idea/entities/idea.entity';

@ObjectType()
@Schema()
export class User {
  @Field(() => String)
  _id: MongooSchema.Types.ObjectId;

  // Add user properties
  @Field(() => String)
  @Prop({ required: true })
  username: string;

  @Field(() => String)
  @Prop({ required: true })
  password: string;

  @Field(() => String, { defaultValue: RolesEnum.USER })
  @Prop({ default: RolesEnum.USER })
  role?: string;

  @Field(() => [Idea])
  @Prop({ type: [{ type: MongooSchema.Types.ObjectId, ref: 'Idea' }] })
  ideas: Idea[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
