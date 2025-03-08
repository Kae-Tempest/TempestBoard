import { User } from '@shared/entities/User.entity';
import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDto } from '@app/projects/dto/create-project.dto';

export class UpdateProjectDto extends PartialType(CreateProjectDto) {
  id: number;
  status: string;
  users: User[];
}
