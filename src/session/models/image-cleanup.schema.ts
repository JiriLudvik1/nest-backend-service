import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';

export type ImageCleanupDocument = ImageCleanup & Document

@Schema()
export class ImageCleanup{
  @Prop({type: String, required: true})
  requestId: string;

  @Prop({type: Date, required: true})
  requestTimestamp: Date;

  @Prop({type: String, required: true})
  requestedBy: string;

  @Prop({type: Boolean, required: true})
  manualRequest: boolean

  @Prop({type: Date, required: true})
  requestFinished: Date;

  @Prop({type: Number, required: true})
  filesDeleted: number;
}

export const ImageCleanupSchema = SchemaFactory.createForClass(ImageCleanup)