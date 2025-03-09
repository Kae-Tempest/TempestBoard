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
import { IssuesService } from '@app/issues/issues.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Issue } from '@shared/entities/Issue.entity';
import { CreateIssueDto } from '@app/issues/dto/create-issue.dto';
import { UpdateIssueDto } from '@app/issues/dto/update-issue.dto';
import { ApiTags } from '@nestjs/swagger';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@ApiTags('Issues')
@Controller('issues')
@UseGuards(JwtAuthGuard, PermissionsGuard, ProjectAccessGuard)
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('/')
  @RequirePermissions(Permission.ADMIN_ACCESS)
  async getAllIssues(): Promise<Issue[]> {
    return await this.issuesService.findAll();
  }

  @Get('/:id')
  @RequirePermissions(Permission.VIEW_ISSUE)
  async getById(@Param('id', ParseIntPipe) id: number): Promise<Issue> {
    return await this.issuesService.findOne(id);
  }

  @Get('/user/:id')
  @RequirePermissions(Permission.VIEW_ISSUE)
  async getUser(@Param('id', ParseIntPipe) userId: number): Promise<Issue[]> {
    return await this.issuesService.findAllByUser(userId);
  }

  @Post('/')
  @RequirePermissions(Permission.CREATE_ISSUE)
  async createIssue(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return await this.issuesService.create(createIssueDto);
  }

  @Patch('/:id')
  @RequirePermissions(Permission.EDIT_ISSUE)
  async updateIssue(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    return await this.issuesService.update(id, updateIssueDto);
  }

  @Delete('/:id')
  @RequirePermissions(Permission.DELETE_ISSUE)
  1;

  async deleteIssue(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.issuesService.delete(id);
  }
}
