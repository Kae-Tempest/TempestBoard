import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectinvitationsService } from '@app/projectinvitations/projectinvitations.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';
import {
  PermissionsGuard,
  RequirePermissions,
} from '@core/auth/guards/permissions.guard';
import { ProjectAccessGuard } from '@core/auth/guards/project.guard';
import { Permission } from '@shared/enums/permissions.enum';

@Controller('projectinvitations')
@UseGuards(JwtAuthGuard)
export class ProjectinvitationsController {
  constructor(
    private readonly projectinvitationsService: ProjectinvitationsService,
  ) {}

  @Post('/')
  @UseGuards(PermissionsGuard, ProjectAccessGuard)
  @RequirePermissions(Permission.MANAGE_PROJECT_MEMBERS)
  async sendEmail(
    @Body() { email, project_id }: { email: string; project_id: number },
  ): Promise<void> {
    await this.projectinvitationsService.sendEmail(email, project_id);
  }

  @Post('/accept')
  async acceptEmail(@Body() token: string): Promise<void> {
    await this.projectinvitationsService.acceptedInvitation(token);
  }
}
