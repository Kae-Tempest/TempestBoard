import { PartialType } from '@nestjs/mapped-types';
import { CreateStateDto } from '@app/states/dto/create-state.dto';

export class UpdateStateDto extends PartialType(CreateStateDto) {
  is_active: boolean;
  is_backlog: boolean;
  is_canceled: boolean;
}
