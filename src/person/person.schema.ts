import { Document } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type PersonDocument = Person & Document

@Schema()
export class Person {
  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop()
  rating: number;

  @Prop()
  ratedAt: Date;
}

export const PersonSchema = SchemaFactory.createForClass(Person)