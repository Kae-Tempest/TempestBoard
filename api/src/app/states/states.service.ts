import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Project } from '@shared/entities/Project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { State } from '@shared/entities/State.entity';
import { CreateStateDto } from '@app/states/dto/create-state.dto';
import { UpdateStateDto } from '@app/states/dto/update-state.dto';

@Injectable()
export class StatesService {
  private readonly logger = new Logger(StatesService.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(State)
    private readonly stateRepository: Repository<State>,
  ) {
    this.logger.log('StatesService initialized');
  }

  public async findOne(id: number): Promise<State> {
    this.logger.log(`Retrieving state with id: ${id}`);

    try {
      const state: State | null = await this.stateRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!state) {
        this.logger.warn(`State with id ${id} not found`);
        throw new NotFoundException(`State with id ${id} not found`);
      }

      this.logger.debug(`Retrieved state: ${JSON.stringify(state)}`);
      return state;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to retrieve state with id ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve state: ${(error as Error).message}`,
      );
    }
  }

  public async findAll(): Promise<State[]> {
    this.logger.log('Retrieving all states');

    try {
      const states = await this.stateRepository.find({
        relations: ['project'],
      });

      this.logger.debug(`Retrieved ${states.length} states`);
      return states;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve states: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to retrieve states: ${(error as Error).message}`,
      );
    }
  }

  public async create(payload: CreateStateDto): Promise<State> {
    this.logger.log(`Creating new state: ${JSON.stringify(payload)}`);

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

      // Check if name is provided
      if (!payload.name) {
        this.logger.warn('State name is required');
        throw new BadRequestException('State name is required');
      }

      // Create new state
      const newState: Partial<State> = {
        name: payload.name,
        project: project,
        is_backlog: true,
        is_active: true,
      };

      const createdState: State = this.stateRepository.create(newState);
      const savedState: State = await this.stateRepository.save(createdState);

      this.logger.log(`Successfully created state with id: ${savedState.id}`);
      return savedState;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to create state: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to create state: ${(error as Error).message}`,
      );
    }
  }

  public async update(id: number, payload: UpdateStateDto): Promise<State> {
    this.logger.log(`Updating state ${id} with: ${JSON.stringify(payload)}`);

    try {
      // Find existing state
      const state: State | null = await this.stateRepository.findOne({
        where: { id },
        relations: ['project'],
      });

      if (!state) {
        this.logger.warn(`State with id ${id} not found`);
        throw new NotFoundException(`State with id ${id} not found`);
      }

      const updateState: Partial<State> = {};

      // Update project if provided
      if (payload.project !== undefined) {
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

        updateState.project = project;
      }

      // Update name if provided
      if (payload.name !== undefined) {
        this.logger.debug(`Updating name to: ${payload.name}`);
        updateState.name = payload.name;
      }

      // Update is_active if provided
      if (payload.is_active !== undefined) {
        this.logger.debug(`Updating is_active to: ${payload.is_active}`);
        updateState.is_active = payload.is_active;
      }

      // Update is_backlog if provided
      if (payload.is_backlog !== undefined) {
        this.logger.debug(`Updating is_backlog to: ${payload.is_backlog}`);
        updateState.is_backlog = payload.is_backlog;
      }

      // Update is_canceled if provided
      if (payload.is_canceled !== undefined) {
        this.logger.debug(`Updating is_canceled to: ${payload.is_canceled}`);
        updateState.is_canceled = payload.is_canceled;
      }

      // Check for conflicting state flags
      if (
        (updateState.is_backlog && updateState.is_canceled) ||
        (state.is_backlog && updateState.is_canceled === true) ||
        (state.is_canceled && updateState.is_backlog === true)
      ) {
        this.logger.warn('A state cannot be both backlog and canceled');
        throw new BadRequestException(
          'A state cannot be both backlog and canceled',
        );
      }

      // Save updated state
      const result: State = await this.stateRepository.save({
        ...state,
        ...updateState,
      });

      this.logger.log(`Successfully updated state ${id}`);
      return result;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }

      this.logger.error(
        `Failed to update state ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to update state: ${(error as Error).message}`,
      );
    }
  }

  public async delete(id: number): Promise<void> {
    this.logger.log(`Deleting state with id: ${id}`);

    try {
      // Check if state exists before deletion
      const state: State | null = await this.stateRepository.findOne({
        where: { id },
      });

      if (!state) {
        this.logger.warn(
          `Attempted to delete non-existent state with id ${id}`,
        );
        throw new NotFoundException(`State with id ${id} not found`);
      }

      await this.stateRepository.delete(id);
      this.logger.log(`Successfully deleted state with id: ${id}`);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(
        `Failed to delete state ${id}: ${(error as Error).message}`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        `Failed to delete state: ${(error as Error).message}`,
      );
    }
  }
}
