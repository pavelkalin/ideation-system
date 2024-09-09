import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class BlacklistedToken extends Document {
  @Prop({ required: true, description: 'Token that is blacklisted' })
  token: string;
}

export const BlacklistedTokenSchema =
  SchemaFactory.createForClass(BlacklistedToken);
