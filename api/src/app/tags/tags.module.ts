import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { Tag } from '@shared/entities/Tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Tag]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [TagsService],
  controllers: [TagsController],
})
export class TagsModule {}
