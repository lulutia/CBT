import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as mongoose from 'mongoose';
// 自定义一个管道做验证使用，MetaData的数据格式如下(不传则为undefined)：
// export interface ArgumentMetadata {
//   type: 'body' | 'query' | 'param' | 'custom';
//   metatype?: Type<unknown>;
//   data?: string;
// }
@Injectable()
export class ValidationObjectId implements PipeTransform {
  async transform(value: any, metdata: ArgumentMetadata) {
    const isValid = mongoose.Types.ObjectId.isValid(value);
    if (!isValid) throw new BadRequestException('Invalid ID!');
    return value;
  }
}
