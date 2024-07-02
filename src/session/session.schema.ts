import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type SessionDocument = Session & Document;

@Schema()
export class Session{
  @Prop({type: Date, default: Date.now})
  createdAt: Date;

  @Prop({type: String, required: true})
  browserId: string

  @Prop({ type: String, required: false })
  imageEtag?: string

  @Prop([{type: Types.ObjectId, ref: "Person"}])
  ratedUsers: Types.ObjectId[];
}

export const SessionSchema = SchemaFactory.createForClass(Session);