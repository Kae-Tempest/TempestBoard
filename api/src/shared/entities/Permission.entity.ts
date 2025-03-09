import {
  Column,
  Entity,
  Index,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '@shared/entities/Role.entity';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  @Index()
  name: string;

  @Column({ nullable: false })
  description: string;

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
