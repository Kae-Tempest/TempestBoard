import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from '@shared/entities/Tag.entity';
import { Repository } from 'typeorm';
import { Project } from '@shared/entities/Project.entity';
import { CreateTagDto } from '@app/tags/dto/create-tag.dto';
import { UpdateTagDto } from '@app/tags/dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  public async getAll(): Promise<Tag[]> {
    return this.tagRepository.find();
  }

  public async getOne(id: number): Promise<Tag> {
    const tag: Tag | null = await this.tagRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException();
    }

    return tag;
  }

  public async create(payload: CreateTagDto): Promise<Tag> {
    const project: Project | null = await this.projectRepository.findOne({
      where: { id: payload.project },
    });
    if (!project) {
      throw new NotFoundException();
    }

    const newTag: Tag = this.tagRepository.create({
      ...payload,
      project,
    });
    return await this.projectRepository.save(newTag);
  }

  public async update(id: number, payload: UpdateTagDto): Promise<Tag> {
    const tag: Tag | null = await this.tagRepository.findOne({
      where: { id: id },
    });
    if (!tag) {
      throw new NotFoundException();
    }

    const updatedTag: Partial<Tag> = {};

    if (payload.project) {
      const project: Project | null = await this.projectRepository.findOne({
        where: { id: payload.project },
      });
      if (!project) {
        throw new NotFoundException();
      }
      updatedTag.project = project;
    }

    if (payload.name) {
      updatedTag.name = payload.name;
    }

    return await this.tagRepository.save({
      ...tag,
      ...updatedTag,
    });
  }

  public async delete(id: number): Promise<void> {
    await this.tagRepository.delete({ id });
  }
}
