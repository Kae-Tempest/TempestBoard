import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinTable,
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
@Index(['project', 'ticket_id'])
@Index(['project', 'status'])
@Index(['assigned', 'status'])
@Index(['creator', 'created_at'])
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  creator: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  assigned: User;

  @ManyToOne(() => Project)
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

  @OneToOne(() => State, (state: State) => state.issues)
  status: State;

  @ManyToMany(() => Tag, (tag: Tag) => tag.id, {
    nullable: true,
  })
  @JoinTable({
    name: 'issue_tags',
    joinColumn: { name: 'issue_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @ManyToOne(() => Milestone, (milestone: Milestone) => milestone.issues, {
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
