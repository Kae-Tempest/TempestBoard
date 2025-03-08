import { Module } from '@nestjs/common';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { User } from '@shared/entities/User.entity';
import { Activity } from '@shared/entities/Activity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Activity, User]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  controllers: [ActivitiesController],
  providers: [ActivitiesService],
})
export class ActivitiesModule {}
