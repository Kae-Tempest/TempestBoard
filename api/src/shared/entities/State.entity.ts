import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Project } from '@shared/entities/Project.entity';
import { Issue } from '@shared/entities/Issue.entity';

@Entity('states')
@Index(['project', 'name'], { unique: true })
@Index(['project', 'is_active'])
export class State {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, { onDelete: 'CASCADE' }) // Fixed relationship
  @Index()
  project: Project;

  @Column()
  @Index()
  name: string;

  @Column('boolean', { default: false })
  is_default: boolean;

  @Column('boolean', { default: true })
  @Index()
  is_active: boolean;

  @Column('boolean', { default: false })
  @Index()
  is_backlog: boolean;

  @Column('boolean', { default: false })
  is_canceled: boolean;

  @OneToMany(() => Issue, (issue) => issue.status)
  issues: Issue[];

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
