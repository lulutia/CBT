import { JobsModule } from './jobs/module/jobs.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [MongooseModule.forRoot('mongodb://localhost/jobs'), JobsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
