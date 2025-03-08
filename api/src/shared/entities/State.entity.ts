import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '@shared/entities/Project.entity';

@Entity('states')
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project: Project) => project.id, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column()
  name: string;

  @Column('boolean', { default: false })
  is_default: boolean;

  @Column('boolean', { default: true })
  is_active: boolean;

  @Column('boolean', { default: false })
  is_backlog: boolean;

  @Column('boolean', { default: false })
  is_canceled: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public created_at: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updated_at: Date;
}
