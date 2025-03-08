import { Module } from '@nestjs/common';
import { ProjectinvitationsService } from './projectinvitations.service';
import { ProjectinvitationsController } from './projectinvitations.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { ProjectInvitation } from '@shared/entities/ProjectInvitation.entity';
import { User } from '@shared/entities/User.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, ProjectInvitation]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [ProjectinvitationsService],
  controllers: [ProjectinvitationsController],
})
export class ProjectinvitationsModule {}
