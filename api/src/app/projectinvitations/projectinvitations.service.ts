import { Injectable, NotFoundException } from '@nestjs/common';
import sgMail from '@sendgrid/mail';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@shared/entities/User.entity';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/Project.entity';
import { ProjectInvitation } from '@shared/entities/ProjectInvitation.entity';

@Injectable()
export class ProjectinvitationsService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(ProjectInvitation)
    private readonly projectInvitationRepository: Repository<ProjectInvitation>,
  ) {}

  async getTemplate(path: string): Promise<string> {
    const response = await fetch(path);
    return response.text();
  }

  populateTemplate(
    template: string,
    variables: Record<string, string>,
  ): string {
    let populatedTemplate = template;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      populatedTemplate = populatedTemplate.replace(placeholder, value);
    }

    return populatedTemplate;
  }

  async sendEmail(email: string, project_id: number): Promise<void> {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

    const token: string = uuidv4();
    const user: User | null = await this.userRepository.findOne({
      where: { email },
    });

    const project: Project | null = await this.projectRepository.findOne({
      where: { id: project_id },
    });

    if (!project) {
      throw new NotFoundException();
    }

    let invitationLink: string;
    let is_user_exist: boolean = false;

    if (user) {
      invitationLink = `${process.env.FRONTEND_URL}/accept-invitation?token=${token}`;
      is_user_exist = true;
    } else {
      invitationLink = `${process.env.FRONTEND_URL}/register?token=${token}&email=${email}`;
    }

    const template: string = await this.getTemplate(
      `@app/templates/projectinvitations.html`,
    );

    const populatedTemplate = this.populateTemplate(template, {
      project_name: project.name,
      invitation_link: invitationLink,
    });

    const container: HTMLDivElement = document.createElement('div');
    container.innerHTML = populatedTemplate;

    const msg = {
      to: email,
      from: 'no-reply.tempestboard@gloupi.com',
      subject: 'Project Invitation',
      html: container.innerHTML,
    };
    await sgMail.send(msg);

    await this.projectInvitationRepository.save({
      token,
      project_id,
      email,
      is_user_exist,
    });
  }

  async acceptedInvitation(token: string): Promise<void> {
    const invitation: ProjectInvitation | null =
      await this.projectInvitationRepository.findOne({
        where: { token },
      });

    if (!invitation) {
      throw new NotFoundException();
    }

    const user: User | null = await this.userRepository.findOne({
      where: { email: invitation.email },
    });

    if (!user) {
      throw new NotFoundException();
    }

    const project: Project | null = await this.projectRepository.findOne({
      where: { id: invitation.project.id },
    });

    if (!project) {
      throw new NotFoundException();
    }

    project.users.push(user);
  }
}
