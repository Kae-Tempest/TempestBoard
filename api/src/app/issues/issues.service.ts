import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '@shared/entities/Issue.entity';
import { Repository } from 'typeorm';
import { CreateIssueDto } from '@app/issues/dto/create-issue.dto';
import { UpdateIssueDto } from '@app/issues/dto/update-issue.dto';
import { User } from '@shared/entities/User.entity';
import { Project } from '@shared/entities/Project.entity';
import { State } from '@shared/entities/State.entity';
import { Tag } from '@shared/entities/Tag.entity';

@Injectable()
export class IssuesService {
  private readonly logger = new Logger(IssuesService.name);

  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  public async findAll(): Promise<Issue[]> {
    this.logger.log('Finding all issues');
    try {
      const issues = await this.issueRepository.find();
      this.logger.debug(`Found ${issues.length} issues`);
      return issues;
    } catch (error) {
      this.logger.error(
        'Failed to retrieve all issues',
        (error as Error).stack,
      );
      throw error;
    }
  }

  public async findOne(id: number): Promise<Issue> {
    this.logger.log(`Finding issue with ID: ${id}`);
    try {
      const issue: Issue | null = await this.issueRepository.findOne({
        where: { id },
      });
      if (!issue) {
        this.logger.warn(`Issue with ID ${id} not found`);
        throw new NotFoundException(`Issue with ID ${id} not found`);
      }
      this.logger.debug(`Found issue: ${issue.title}`);
      return issue;
    } catch (error) {
      this.logger.error(
        `Error finding issue with ID: ${id}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  public async findAllByUser(userId: number): Promise<Issue[]> {
    this.logger.log(`Finding all issues for user with ID: ${userId}`);
    try {
      this.logger.debug(`Searching for issues created by user ${userId}`);
      const creatorIssues: Issue[] = await this.issueRepository.find({
        where: { creator: { id: userId } },
      });
      this.logger.debug(
        `Found ${creatorIssues.length} issues created by user ${userId}`,
      );

      this.logger.debug(`Searching for issues assigned to user ${userId}`);
      const assignedIssues: Issue[] = await this.issueRepository.find({
        where: { assigned: { id: userId } },
      });
      this.logger.debug(
        `Found ${assignedIssues.length} issues assigned to user ${userId}`,
      );

      const issues: Issue[] = [...assignedIssues, ...creatorIssues];
      this.logger.log(`Found total ${issues.length} issues for user ${userId}`);

      return issues;
    } catch (error) {
      this.logger.error(
        `Error finding issues for user ${userId}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  public async create(payload: CreateIssueDto): Promise<Issue> {
    this.logger.log(`Creating new issue: ${payload.title}`);
    try {
      this.logger.debug(`Finding creator with ID: ${payload.creator}`);
      const creator: User | null = await this.userRepository.findOne({
        where: { id: payload.creator },
      });
      if (!creator) {
        this.logger.warn(`User with ID ${payload.creator} not found`);
        throw new NotFoundException(
          `User with id ${payload.creator} not found`,
        );
      }

      this.logger.debug(`Finding assigned user with ID: ${payload.assigned}`);
      const assigned: User | null = await this.userRepository.findOne({
        where: { id: payload.assigned },
      });
      if (!assigned) {
        this.logger.warn(`User with ID ${payload.assigned} not found`);
        throw new NotFoundException(
          `User with id ${payload.assigned} not found`,
        );
      }

      this.logger.debug(`Finding project with ID: ${payload.project}`);
      const project: Project | null = await this.projectRepository.findOne({
        where: { id: payload.project },
      });
      if (!project) {
        this.logger.warn(`Project with ID ${payload.project} not found`);
        throw new NotFoundException(
          `Project with id ${payload.project} not found`,
        );
      }

      const project_tag: string = project.name.slice(0, 3).toUpperCase();
      this.logger.debug(`Generated project tag: ${project_tag}`);

      this.logger.debug(`Finding state with name: ${payload.status}`);
      const status: State | null = await this.stateRepository.findOne({
        where: { name: payload.status },
      });

      if (!status) {
        this.logger.warn(`State with name ${payload.status} not found`);
        throw new NotFoundException(
          `State with name ${payload.status} not found`,
        );
      }

      this.logger.debug(`Finding tags: ${payload.tags?.join(', ') || 'none'}`);
      const tagPromises: Promise<Tag[]>[] = payload.tags
        ? payload.tags.map((t: string) =>
            this.tagRepository.findBy({ name: t }),
          )
        : [];

      const tagArrays: Tag[][] = await Promise.all(tagPromises);
      const tags: Tag[] = tagArrays.flat();
      this.logger.debug(`Found ${tags.length} tags`);

      const issue: Partial<Issue> = {
        ...payload,
        assigned,
        creator,
        project,
        status,
        tags,
        project_tag,
      };

      const createdIssue: Issue = this.issueRepository.create(issue);
      const savedIssue: Issue = await this.issueRepository.save(createdIssue);
      this.logger.log(`Successfully created issue with ID: ${savedIssue.id}`);

      return savedIssue;
    } catch (err) {
      this.logger.error(
        `Failed to create issue: ${payload.title}`,
        (err as Error).stack,
      );
      throw new BadRequestException('Failed to create issue');
    }
  }

  public async update(id: number, payload: UpdateIssueDto): Promise<Issue> {
    this.logger.log(`Updating issue with ID: ${id}`);
    try {
      const issue: Issue | null = await this.issueRepository.findOne({
        where: { id },
      });

      if (!issue) {
        this.logger.warn(`Error finding issue with ID: ${id}`);
        throw new NotFoundException(`Error finding issue with ID: ${id}`);
      }

      const updatedIssue: Partial<Issue> = {};

      if (payload.title) {
        this.logger.debug(`Updating title to: ${payload.title}`);
        updatedIssue.title = payload.title;
      }

      if (payload.description) {
        this.logger.debug(`Updating description`);
        updatedIssue.description = payload.description;
      }

      if (payload.priority) {
        this.logger.debug(`Updating priority to: ${payload.priority}`);
        updatedIssue.priority = payload.priority;
      }

      if (payload.assigned) {
        this.logger.debug(`Updating assigned user to ID: ${payload.assigned}`);
        const assigned = await this.userRepository.findOne({
          where: { id: payload.assigned },
        });
        if (!assigned) {
          this.logger.warn(`User with ID ${payload.assigned} not found`);
          throw new NotFoundException(
            `User with id ${payload.assigned} not found`,
          );
        }
        updatedIssue.assigned = assigned;
      }

      if (payload.project) {
        this.logger.debug(`Updating project to ID: ${payload.project}`);
        const project = await this.projectRepository.findOne({
          where: { id: payload.project },
        });
        if (!project) {
          this.logger.warn(`Project with ID ${payload.project} not found`);
          throw new NotFoundException(
            `Project with id ${payload.project} not found`,
          );
        }
        updatedIssue.project = project;
        updatedIssue.project_tag = project.name.slice(0, 3).toUpperCase();
        this.logger.debug(
          `Updated project_tag to: ${updatedIssue.project_tag}`,
        );
      }

      // Handle status update if provided
      if (payload.status) {
        this.logger.debug(`Updating status to: ${payload.status}`);
        const status = await this.stateRepository.findOne({
          where: { name: payload.status },
        });
        if (!status) {
          this.logger.warn(`State with name ${payload.status} not found`);
          throw new NotFoundException(
            `State with name ${payload.status} not found`,
          );
        }
        updatedIssue.status = status;
      }

      // Handle tags update if provided
      if (payload.tags) {
        this.logger.debug(`Updating tags: ${payload.tags.join(', ')}`);
        const tagPromises = payload.tags.map((t: string) =>
          this.tagRepository.findBy({ name: t }),
        );
        const tagArrays = await Promise.all(tagPromises);
        updatedIssue.tags = tagArrays.flat();
        this.logger.debug(`Found ${updatedIssue.tags.length} tags`);
      }

      // Update the issue with new values
      this.logger.debug(`Saving updated issue`);
      const result = await this.issueRepository.save({
        ...issue,
        ...updatedIssue,
      });

      this.logger.log(`Successfully updated issue with ID: ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update issue with ID: ${id}`,
        (error as Error).stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update issue: ${(error as Error).message}`,
      );
    }
  }

  // TODO: Add Update Attachment
  // TODO: Add Delete Attachment

  public async delete(id: number): Promise<void> {
    this.logger.log(`Deleting issue with ID: ${id}`);
    try {
      const result = await this.issueRepository.delete(id);
      if (result.affected === 0) {
        this.logger.warn(`Issue with ID ${id} not found for deletion`);
        throw new NotFoundException(`Issue with ID ${id} not found`);
      }
      this.logger.log(`Successfully deleted issue with ID: ${id}`);
    } catch (error) {
      this.logger.error(
        `Failed to delete issue with ID: ${id}`,
        (error as Error).stack,
      );
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete issue: ${(error as Error).message}`,
      );
    }
  }
}
