import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Activity } from '@shared/entities/Activity';
import { Issue } from '@shared/entities/Issue.entity';
import { User } from '@shared/entities/User.entity';
import { UpdateActivityDto } from '@app/activities/dto/update-activity.dto';
import { CreateActivityDto } from '@app/activities/dto/create-activity.dto';

@Injectable()
export class ActivitiesService {
  private readonly logger = new Logger(ActivitiesService.name);

  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    this.logger.log('ActivitiesService initialized');
  }

  async findAll(): Promise<Activity[]> {
    this.logger.log('Retrieving all activities');

    try {
      const activities = await this.activityRepository.find();
      this.logger.debug(`Retrieved ${activities.length} activities`);
      return activities;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve activities: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async findOne(id: number): Promise<Activity> {
    this.logger.log(`Retrieving activity with id: ${id}`);

    try {
      const activity: Activity | null = await this.activityRepository.findOne({
        where: { id },
        relations: ['issue', 'user'],
      });

      if (!activity) {
        this.logger.warn(`Activity with id ${id} not found`);
        throw new NotFoundException(`Activity with id ${id} not found`);
      }

      this.logger.debug(`Retrieved activity: ${JSON.stringify(activity)}`);
      return activity;
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to retrieve activity with id ${id}: ${(error as Error).message}`,
          (error as Error).stack,
        );
      }
      throw error;
    }
  }

  async create(payload: CreateActivityDto): Promise<Activity> {
    this.logger.log(`Creating new activity: ${JSON.stringify(payload)}`);

    try {
      // Find issue
      this.logger.debug(`Looking up issue with id: ${payload.issue}`);
      const issue: Issue | null = await this.issueRepository.findOne({
        where: { id: payload.issue },
      });

      if (!issue) {
        this.logger.warn(`No issue found with id ${payload.issue}`);
        throw new NotFoundException(`No issue found with id ${payload.issue}`);
      }

      // Find user
      this.logger.debug(`Looking up user with id: ${payload.user}`);
      const user: User | null = await this.userRepository.findOne({
        where: { id: payload.user },
      });

      if (!user) {
        this.logger.warn(`No user found with id ${payload.user}`);
        throw new NotFoundException(`No user found with id ${payload.user}`);
      }

      // Create new activity
      const newActivity: Activity = this.activityRepository.create({
        ...payload,
        issue,
        user,
      });

      const savedActivity = await this.activityRepository.save(newActivity);
      this.logger.log(
        `Successfully created activity with id: ${savedActivity.id}`,
      );
      return savedActivity;
    } catch (error) {
      this.logger.error(
        `Failed to create activity: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async update(id: number, payload: UpdateActivityDto): Promise<Activity> {
    this.logger.log(`Updating activity ${id} with: ${JSON.stringify(payload)}`);

    try {
      // Find existing activity
      const activity: Activity | null = await this.activityRepository.findOne({
        where: { id },
        relations: ['issue', 'user'],
      });

      if (!activity) {
        this.logger.warn(`No activity found with id ${id}`);
        throw new NotFoundException(`No activity found with id ${id}`);
      }

      const updatedActivity: Partial<Activity> = {};

      // Update issue if provided
      if (payload.issue) {
        this.logger.debug(`Looking up issue with id: ${payload.issue}`);
        const issue: Issue | null = await this.issueRepository.findOne({
          where: { id: payload.issue },
        });

        if (!issue) {
          this.logger.warn(`No issue found with id ${payload.issue}`);
          throw new NotFoundException(
            `No issue found with id ${payload.issue}`,
          );
        }

        updatedActivity.issue = issue;
      }

      // Update user if provided
      if (payload.user) {
        this.logger.debug(`Looking up user with id: ${payload.user}`);
        const user: User | null = await this.userRepository.findOne({
          where: { id: payload.user },
        });

        if (!user) {
          this.logger.warn(`No user found with id ${payload.user}`);
          throw new NotFoundException(`No user found with id ${payload.user}`);
        }
        updatedActivity.user = user;
      }

      // Update content if provided
      if (payload.content !== undefined) {
        this.logger.debug(`Updating content to: ${payload.content}`);
        updatedActivity.content = payload.content;
      }

      // Update type if provided
      if (payload.type !== undefined) {
        this.logger.debug(`Updating type to: ${payload.type}`);
        updatedActivity.type = payload.type;
      }

      // Save updated activity
      const result = await this.activityRepository.save({
        ...activity,
        ...updatedActivity,
      });

      this.logger.log(`Successfully updated activity ${id}`);
      return result;
    } catch (error) {
      this.logger.error(
        `Failed to update activity ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Deleting activity with id: ${id}`);

    try {
      // Check if activity exists before deletion
      const activity = await this.activityRepository.findOne({
        where: { id },
      });

      if (!activity) {
        this.logger.warn(
          `Attempted to delete non-existent activity with id ${id}`,
        );
        throw new NotFoundException(`Activity with id ${id} not found`);
      }

      await this.activityRepository.delete(id);
      this.logger.log(`Successfully deleted activity with id: ${id}`);
    } catch (error) {
      if (!(error instanceof NotFoundException)) {
        this.logger.error(
          `Failed to delete activity ${id}: ${(error as Error).message}`,
          (error as Error).stack,
        );
      }
      throw error;
    }
  }
}
