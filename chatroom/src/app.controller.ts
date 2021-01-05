import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('test')
  getTest(): string {
    return 'test';
  }
  // 与具体request的绑定关系
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
