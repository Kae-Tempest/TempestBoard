import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  username: string;
  first_name: string;
  last_name: string;
  thumbnail: string;
  password: string;
  new_password: string;
}
