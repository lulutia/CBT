import { CreateJobDto } from '../dto/create-job.dto';
import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Param,
  Res,
  NotFoundException,
  Body,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { JobsService } from '../service/jobs.service';
import { ValidationObjectId } from '../../shared/pipes/validate-object-id.pipes';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // 测试
  @Get('test')
  getTest() {
    return 'hello~~~~';
  }
  // 获取TODO列表
  @Get('list')
  async getJobs(@Res() res) {
    const jobs = await this.jobsService.findAll();
    return res.status(HttpStatus.OK).json(jobs);
  }

  // 查询某个TODO
  @Get('job/:jobTitle')
  async getJobByTitle(
    @Res() res,
    @Param('title', new ValidationObjectId()) title,
  ) {
    const job = await this.jobsService.findByTitle(title);
    if (!job) {
      throw new NotFoundException('没有此TODO');
    }
    return res.status(HttpStatus.OK).json(job);
  }

  @Post('/post')
  async addJob(@Res() res, @Body() createJobDto: CreateJobDto) {
    const newJob = await this.jobsService.create(createJobDto);
    return res.status(HttpStatus.OK).json({
      message: '添加TODO成功',
      job: newJob,
    });
  }

  @Put('/edit')
  async editJob(
    @Res() res,
    @Query('title', new ValidationObjectId()) title,
    @Body() editJobDto: CreateJobDto,
  ) {
    const editJob = await this.jobsService.editJob(title, editJobDto);
    if (!editJob) {
      throw new NotFoundException('没有此TODO');
    }
    return res.status(HttpStatus.OK).json({
      message: '修改TODO成功',
      job: editJob,
    });
  }

  @Delete('/delete')
  async deleteJob(@Res() res, @Query('title', new ValidationObjectId()) title) {
    const deletedJob = await this.jobsService.deleteJob(title);
    if (!deletedJob) {
      throw new NotFoundException('没有此TODO');
    }
    return res.status(HttpStatus.OK).json({
      message: '删除TODO成功',
      job: deletedJob,
    });
  }
}
