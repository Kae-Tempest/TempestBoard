import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
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
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('State')
@Controller('states')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class StatesController {
  constructor(private readonly stateService: StatesService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async getStates(): Promise<State[]> {
    return this.stateService.findAll();
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number): Promise<State> {
    return this.stateService.findOne(id);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_STATE)
  async create(@Body() createStateDto: CreateStateDto): Promise<State> {
    return this.stateService.create(createStateDto);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_STATE)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStateDto: UpdateStateDto,
  ): Promise<State> {
    return this.stateService.update(id, updateStateDto);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_STATE)
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.stateService.delete(id);
  }
}
