import { Length, IsInt, Min, Max } from 'class-validator';

export class CreateJobDto {
  @Length(1, 20)
  title: string;

  @Length(1, 200)
  desc: string;

  @IsInt()
  @Min(0)
  beginTime: number;

  @IsInt()
  @Min(0)
  endTime: number;

  @IsInt()
  @Min(0)
  @Max(5)
  level: number;
}
