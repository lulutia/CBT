import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from '../schemas/jobs.schema';
import { CreateJobDto } from '../dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(@InjectModel('Job') private jobModel: Model<JobDocument>) {}

  // 创建TODO
  async create(createJobDto: CreateJobDto): Promise<Job> {
    const createdJob = new this.jobModel(createJobDto);
    return createdJob.save();
  }

  // 查询所有TODO
  async findAll(): Promise<Job[]> {
    return this.jobModel.find().exec();
  }

  // 查询某个名称的TODO
  async findByTitle(title: string): Promise<Job> {
    return this.jobModel.findById(title).exec();
  }

  // 删除某个名称的TODO
  async deleteJob(title: string): Promise<any> {
    return this.jobModel.findByIdAndRemove(title).exec();
  }

  // 修改某个名称的TODO
  async editJob(title: string, editJobDto: CreateJobDto): Promise<Job> {
    const editJob = this.jobModel.findByIdAndUpdate(title, editJobDto, {
      new: true,
    });
    return editJob;
  }
}
