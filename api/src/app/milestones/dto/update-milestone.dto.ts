import { PartialType } from '@nestjs/mapped-types';
import { CreateMilestoneDto } from '@app/milestones/dto/create-milestone.dto';

export class UpdateMilestoneDto extends PartialType(CreateMilestoneDto) {}
