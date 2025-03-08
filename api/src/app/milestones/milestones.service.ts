import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Milestone } from '@shared/entities/Milestone.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/Project.entity';
import { CreateMilestoneDto } from '@app/milestones/dto/create-milestone.dto';
import { UpdateMilestoneDto } from '@app/milestones/dto/update-milestone.dto';

@Injectable()
export class MilestonesService {
  private readonly logger = new Logger(MilestonesService.name);

  constructor(
    @InjectRepository(Milestone)
    private readonly milestoneRepository: Repository<Milestone>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {
    this.logger.log('MilestonesService initialized');
  }

  public async findAll(): Promise<Milestone[]> {
    this.logger.log('Retrieving all milestones');

    try {
      const milestones = await this.milestoneRepository.find({
        relations: ['project'],
      });
      this.logger.debug(`Retrieved ${milestones.length} milestones`);
      return milestones;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve milestones: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve milestones: ${(error as Error).message}`,
      );
    }
  }

  public async findById(id: number): Promise<Milestone> {
    this.logger.log(`Retrieving milestone with id: ${id}`);

    try {
      const milestone: Milestone | null =
        await this.milestoneRepository.findOne({
          where: { id },
          relations: ['project'],
        });

      if (!milestone) {
        this.logger.warn(`Milestone with id ${id} not found`);
        throw new NotFoundException(`Milestone with id ${id} not found`);
      }

      this.logger.debug(`Retrieved milestone: ${JSON.stringify(milestone)}`);
      return milestone;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to retrieve milestone with id ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve milestone: ${(error as Error).message}`,
      );
    }
  }

  public async create(payload: CreateMilestoneDto): Promise<Milestone> {
    this.logger.log(`Creating new milestone: ${JSON.stringify(payload)}`);

    try {
      // Find project
      this.logger.debug(`Looking up project with id: ${payload.project}`);
      const project: Project | null = await this.projectRepository.findOne({
        where: { id: payload.project },
      });

      if (!project) {
        this.logger.warn(`Project with id ${payload.project} not found`);
        throw new NotFoundException(
          `Project not found with id: ${payload.project}`,
        );
      }

      // Validate dates if both are provided
      if (payload.start_date && payload.delivery_date) {
        const startDate = new Date(payload.start_date);
        const deliveryDate = new Date(payload.delivery_date);

        if (startDate > deliveryDate) {
          this.logger.warn('Start date cannot be after delivery date');
          throw new BadRequestException(
            'Start date cannot be after delivery date',
          );
        }
      }

      // Create new milestone
      const newMilestone: Partial<Milestone> = { ...payload, project };
      const createdMilestone = this.milestoneRepository.create(newMilestone);

      const savedMilestone =
        await this.milestoneRepository.save(createdMilestone);
      this.logger.log(
        `Successfully created milestone with id: ${savedMilestone.id}`,
      );
      return savedMilestone;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to create milestone: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to create milestone: ${(error as Error).message}`,
      );
    }
  }

  public async update(
    id: number,
    payload: UpdateMilestoneDto,
  ): Promise<Milestone> {
    this.logger.log(
      `Updating milestone ${id} with: ${JSON.stringify(payload)}`,
    );

    try {
      // Find existing milestone
      const milestone: Milestone | null =
        await this.milestoneRepository.findOne({
          where: { id },
          relations: ['project'],
        });

      if (!milestone) {
        this.logger.warn(`Milestone with id ${id} not found`);
        throw new NotFoundException(`Milestone with id ${id} not found`);
      }

      const updatedMilestone: Partial<Milestone> = {};

      // Update project if provided
      if (payload.project) {
        this.logger.debug(`Looking up project with id: ${payload.project}`);
        const project: Project | null = await this.projectRepository.findOne({
          where: { id: payload.project },
        });

        if (!project) {
          this.logger.warn(`Project with id ${payload.project} not found`);
          throw new NotFoundException(
            `Project not found with id: ${payload.project}`,
          );
        }

        updatedMilestone.project = project;
      }

      // Update name if provided
      if (payload.name !== undefined) {
        this.logger.debug(`Updating name to: ${payload.name}`);
        updatedMilestone.name = payload.name;
      }

      // Update description if provided
      if (payload.description !== undefined) {
        this.logger.debug(`Updating description`);
        updatedMilestone.description = payload.description;
      }

      // Update start_date if provided
      if (payload.start_date !== undefined) {
        this.logger.debug(
          `Updating start_date to: ${payload.start_date.toString()}`,
        );
        updatedMilestone.start_date = payload.start_date;
      }

      // Update delivery_date if provided
      if (payload.delivery_date !== undefined) {
        this.logger.debug(
          `Updating delivery_date to: ${payload.delivery_date.toString()}`,
        );
        updatedMilestone.delivery_date = payload.delivery_date;
      }

      // Validate dates if both are being updated or one is being updated and the other exists
      const startDate: Date = payload.start_date
        ? new Date(payload.start_date)
        : milestone.start_date;

      const deliveryDate: Date = payload.delivery_date
        ? new Date(payload.delivery_date)
        : milestone.delivery_date;

      if (startDate && deliveryDate && startDate > deliveryDate) {
        this.logger.warn('Start date cannot be after delivery date');
        throw new BadRequestException(
          'Start date cannot be after delivery date',
        );
      }

      // Save updated milestone
      const result: Milestone = await this.milestoneRepository.save({
        ...milestone,
        ...updatedMilestone,
      });

      this.logger.log(`Successfully updated milestone ${id}`);
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to update milestone ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to update milestone: ${(error as Error).message}`,
      );
    }
  }

  public async delete(id: number): Promise<void> {
    this.logger.log(`Deleting milestone with id: ${id}`);

    try {
      // Check if milestone exists before deletion
      const milestone: Milestone | null =
        await this.milestoneRepository.findOne({
          where: { id },
        });

      if (!milestone) {
        this.logger.warn(
          `Attempted to delete non-existent milestone with id ${id}`,
        );
        throw new NotFoundException(`Milestone with id ${id} not found`);
      }

      await this.milestoneRepository.delete(id);
      this.logger.log(`Successfully deleted milestone with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to delete milestone ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to delete milestone: ${(error as Error).message}`,
      );
    }
  }
}
