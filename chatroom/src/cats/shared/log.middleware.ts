import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'Express';

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request.......');
    next();
  }
}
