import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/User.entity';
import { Issue } from '@shared/entities/Issue.entity';
import { Comment } from '@shared/entities/Comment.entity';
import { MulterModule } from '@nestjs/platform-express';
import { ThrottlerModule } from '@nestjs/throttler';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Issue, User]),
    MulterModule.register({
      limits: { fileSize: 5 * 1024 * 1024 /* 5MB limit*/ },
    }),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [CommentsService],
  controllers: [CommentsController],
})
export class CommentsModule {}
