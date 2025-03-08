import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectinvitationsService } from '@app/projectinvitations/projectinvitations.service';
import { JwtAuthGuard } from '@core/auth/guards/jwt.guard';

@Controller('projectinvitations')
export class ProjectinvitationsController {
  constructor(
    private readonly projectinvitationsService: ProjectinvitationsService,
  ) {}

  @Post('/')
  @UseGuards(JwtAuthGuard)
  async sendEmail(
    @Body() { email, project_id }: { email: string; project_id: number },
  ): Promise<void> {
    await this.projectinvitationsService.sendEmail(email, project_id);
  }

  @Post('/accept')
  @UseGuards(JwtAuthGuard)
  async acceptEmail(@Body() token: string): Promise<void> {
    await this.projectinvitationsService.acceptedInvitation(token);
  }
}
