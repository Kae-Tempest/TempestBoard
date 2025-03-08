import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StatesService } from '@app/states/states.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { State } from '@shared/entities/State.entity';
import { CreateStateDto } from '@app/states/dto/create-state.dto';
import { UpdateStateDto } from '@app/states/dto/update-state.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('State')
@Controller('states')
export class StatesController {
  constructor(private readonly stateService: StatesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getStates(): Promise<State[]> {
    return this.stateService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  getById(@Param('id') id: string): Promise<State> {
    return this.stateService.findOne(parseInt(id));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this.stateService.create(createStateDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<State> {
    return this.stateService.update(parseInt(id), updateStateDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string): Promise<void> {
    return this.stateService.delete(parseInt(id));
  }
}
