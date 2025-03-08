import { Module } from '@nestjs/common';
import { IssuesController } from './issues.controller';
import { IssuesService } from './issues.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { User } from '@shared/entities/User.entity';
import { State } from '@shared/entities/State.entity';
import { Issue } from '@shared/entities/Issue.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';
import { Tag } from '@shared/entities/Tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Tag, User, State, Issue]),
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 /* 5MB limit*/ },
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  controllers: [IssuesController],
  providers: [IssuesService],
})
export class IssuesModule {}
