import { Module } from '@nestjs/common';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Role } from '@shared/entities/Role.entity';
import { Permission } from '@shared/entities/Permission.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Role, Permission]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
