import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@shared/entities/User.entity';
import { Issue } from '@shared/entities/Issue.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Issue, { onDelete: 'CASCADE' })
  @Index()
  issue: Issue;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  creator: User;

  @Column('text')
  content: string;

  @Column('boolean', { default: false })
  is_answer: boolean;

  @ManyToOne(() => Comment, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  comment_parent: Comment | null;

  @Column('boolean', { default: false })
  is_thread: boolean;

  @Column('boolean', { default: false })
  is_resolved: boolean;

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
