import { Module } from '@nestjs/common';
import { AuthModule } from '@core/auth/auth.module';
import { UsersModule } from '@app/users/users.module';
import { ProjectsModule } from '@app/projects/projects.module';
import { IssuesModule } from '@app/issues/issues.module';
import { StatesModule } from '@app/states/states.module';
import { RolesModule } from '@app/roles/roles.module';
import { TagsModule } from '@app/tags/tags.module';
import { ActivitiesModule } from '@app/activities/activities.module';
import { CommentsModule } from '@app/comments/comments.module';
import { MilestonesModule } from '@app/milestones/milestones.module';
import { ProjectinvitationsModule } from '@app/projectinvitations/projectinvitations.module';
import { ConfigModule } from '@nestjs/config';
import appConfig from '@core/database/database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(appConfig()),
    AuthModule,
    UsersModule,
    ProjectsModule,
    IssuesModule,
    StatesModule,
    RolesModule,
    TagsModule,
    ActivitiesModule,
    CommentsModule,
    MilestonesModule,
    ProjectinvitationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
