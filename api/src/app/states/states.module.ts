import { Module } from '@nestjs/common';
import { StatesService } from './states.service';
import { StatesController } from './states.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { State } from '@shared/entities/State.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, State]),
    ThrottlerModule.forRoot({ throttlers: [{ ttl: 60000, limit: 10 }] }),
  ],
  providers: [StatesService],
  controllers: [StatesController],
})
export class StatesModule {}
