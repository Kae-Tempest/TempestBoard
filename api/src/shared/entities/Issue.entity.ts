import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@shared/entities/User.entity';
import { Project } from '@shared/entities/Project.entity';
import { Tag } from '@shared/entities/Tag.entity';
import { Milestone } from '@shared/entities/Milestone.entity';
import { State } from '@shared/entities/State.entity';

@Entity('issues')
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user: User) => user.id, { onDelete: 'CASCADE' })
  creator: User;

  @OneToOne(() => User, (user: User) => user.id, { onDelete: 'CASCADE' })
  assigned: User;

  @ManyToOne(() => Project, (project: Project) => project.id)
  project: Project;

  @Column()
  project_tag: string;

  @Column()
  ticket_id: number;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column()
  priority: string;

  @OneToOne(() => State, (state: State) => state.name)
  status: State;

  @ManyToMany(() => Tag, (tag: Tag) => tag.id, {
    nullable: true,
  })
  tags: Tag[];

  @ManyToOne(() => Milestone, (milestone: Milestone) => milestone.id, {
    nullable: true,
  })
  milestone: Milestone;

  @Column({ nullable: true })
  attachment: string;

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
