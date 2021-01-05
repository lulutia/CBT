import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type JobDocument = Job & Document;

@Schema()
export class Job extends Document {
  @Prop()
  title: string;

  @Prop()
  desc: string;

  @Prop()
  beginTime: number;

  @Prop()
  endTime: number;

  @Prop()
  level: number;
}

export const JobSchema = SchemaFactory.createForClass(Job);
