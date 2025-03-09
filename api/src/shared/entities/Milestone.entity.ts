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

@Entity('milestones')
@Index(['project', 'start_date'])
@Index(['project', 'delivery_date'])
export class Milestone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Project)
  project: Project;

  @OneToMany(() => Issue, (issue: Issue) => issue.milestone)
  issues: Issue[];

  @Column('text')
  description: string;

  @Column('timestamp')
  start_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  delivery_date: Date;

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
