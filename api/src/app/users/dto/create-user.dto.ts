import { Exclude } from 'class-transformer';

export class CreateUserDto {
  id?: number;
  username: string;
  @Exclude()
  password: string;
  email: string;
}
