import { User } from '@shared/entities/User.entity';
import { Project } from '@shared/entities/Project.entity';
import { Activity } from '@shared/entities/Activity';
import { Issue } from '@shared/entities/Issue.entity';
import { Milestone } from '@shared/entities/Milestone.entity';
import { ProjectInvitation } from '@shared/entities/ProjectInvitation.entity';
import { Tag } from '@shared/entities/Tag.entity';
import { Role } from '@shared/entities/Role.entity';
import { State } from '@shared/entities/State.entity';
import { Comment } from '@shared/entities/Comment.entity';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

function appConfig(): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    host: process.env.PG_HOST,
    port: parseInt(process.env.PG_HOST as string),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DBNAME,
    entities: [
      User,
      Project,
      Activity,
      Comment,
      Issue,
      Milestone,
      ProjectInvitation,
      Role,
      State,
      Tag,
    ],
    synchronize: true,
    dropSchema: false,
    logging: true,
  };
}

export default appConfig;
