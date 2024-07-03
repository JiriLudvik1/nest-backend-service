import { IsArray, IsString, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class UpsertSessionDto {
  @IsArray()
  ratedUsers: Types.ObjectId[];

  @IsString()
  @IsNotEmpty()
  browserId: string;
}