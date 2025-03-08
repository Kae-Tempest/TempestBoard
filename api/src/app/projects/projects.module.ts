import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { Project } from '@shared/entities/Project.entity';
import { Milestone } from '@shared/entities/Milestone.entity';
import { User } from '@shared/entities/User.entity';
import { ProjectsController } from './projects.controller';
import { Issue } from '@shared/entities/Issue.entity';
import { State } from '@shared/entities/State.entity';
import { Role } from '@shared/entities/Role.entity';
import { Tag } from '@shared/entities/Tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Project,
      Milestone,
      User,
      State,
      Issue,
      Role,
      Tag,
    ]),
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 /* 5MB limit*/ },
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
