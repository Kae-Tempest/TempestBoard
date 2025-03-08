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
import { IssuesService } from '@app/issues/issues.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import { Issue } from '@shared/entities/Issue.entity';
import { CreateIssueDto } from '@app/issues/dto/create-issue.dto';
import { UpdateIssueDto } from '@app/issues/dto/update-issue.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Issues')
@Controller('issues')
export class IssuesController {
  constructor(private readonly issuesService: IssuesService) {}

  @Get('/')
  @UseGuards(JwtAuthGuard)
  async getAllIssues(): Promise<Issue[]> {
    return await this.issuesService.findAll();
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') id: string): Promise<Issue> {
    return await this.issuesService.findOne(parseInt(id));
  }

  @Get('/user/:id')
  @UseGuards(JwtAuthGuard)
  async getUser(@Param('id') userId: string): Promise<Issue[]> {
    return await this.issuesService.findAllByUser(parseInt(userId));
  }

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async createIssue(@Body() createIssueDto: CreateIssueDto): Promise<Issue> {
    return await this.issuesService.create(createIssueDto);
  }

  @Patch('/:id')
  @UseGuards(JwtAuthGuard)
  async updateIssue(
    @Param('id') id: string,
    @Body() updateIssueDto: UpdateIssueDto,
  ): Promise<Issue> {
    return await this.issuesService.update(parseInt(id), updateIssueDto);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard)
  async deleteIssue(@Param('id') id: string): Promise<void> {
    await this.issuesService.delete(parseInt(id));
  }
}
