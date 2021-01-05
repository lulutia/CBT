import * as Joi from 'joi';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Param,
  Res,
  HttpException,
  NotAcceptableException,
  ExceptionFilter,
  ArgumentsHost,
  Catch,
  UseFilters,
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  UsePipes,
  CanActivate,
  ExecutionContext,
  UseGuards,
  SetMetadata,
  NestInterceptor,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Cat } from './cats.interface';
import { CatsService } from './cats.service';
import { CreateCatDto } from './create-cat.dto';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// 一个自定义的拦截器
@Injectable()
class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('before~~~~~~~');
    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`After...${Date.now() - now}ms`)));
  }
}
// 一个自定义的装饰器
const Roles = (...roles: string[]) => SetMetadata('roles', roles);

// 一个自定义的守卫
class NewGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const userArray = ['admin', 'general'];
    return userArray.indexOf(roles[0]) > -1;
  }
}

// 一个自定义的错误拦截
class NewException extends HttpException {
  constructor() {
    super('FOR', HttpStatus.FORBIDDEN);
  }
}

// 一个自定义的ExceptionFilter(核心就是对错误进行过滤与包装或者组装)
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const response = ctx.getResponse();

    response.status(status).json({
      statusCode: status,
      timeStamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
// 自定义一个管道做验证使用，MetaData的数据格式如下(不传则为undefined)：
// export interface ArgumentMetadata {
//   type: 'body' | 'query' | 'param' | 'custom';
//   metatype?: Type<unknown>;
//   data?: string;
// }
@Injectable()
export class ValidationPipe1 implements PipeTransform {
  constructor(private scheme) {}
  transform(value: any, metdata: ArgumentMetadata) {
    const { error } = this.scheme.validate(value);
    if (error) {
      throw new NewException();
    }
    return value;
  }
}

@Injectable()
export class NumberValidation implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): any {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new NewException();
    }
    return {
      name: 'new name',
      age: val,
    };
  }
}

// 校验schema
const createCatSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
  age: Joi.number().min(0).max(100).required(),
  breed: Joi.string().max(100).required(),
});

// 一个控制器，基于path cats
@Controller('cats')
@UseGuards(new NewGuard(new Reflector()))
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private catsService: CatsService) {} // 注意这里已经创建并初始化了catService成员

  @Post()
  @Roles('admin')
  @UsePipes(new ValidationPipe1(createCatSchema))
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get('exception1')
  @Roles('admin')
  @UseFilters(new HttpExceptionFilter())
  findException(): any {
    throw new NotAcceptableException();
  }

  @Get('exception2')
  @Roles('general')
  findException2(): any {
    throw new NewException();
  }

  @Get('exception3')
  @Roles('traveller')
  findException3(): any {
    throw new HttpException(
      { status: HttpStatus.FORBIDDEN, message: 'this is a test' },
      HttpStatus.FORBIDDEN,
    );
  }

  @Get('/:id')
  @Roles('admin')
  getCats(@Param('id', new NumberValidation()) params, @Res() res): any {
    const data = params;
    res.status(HttpStatus.OK).json(data);
  }

  @Get() //  to create a handler for a specific endpoint for HTTP requests
  @Roles('admin')
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
