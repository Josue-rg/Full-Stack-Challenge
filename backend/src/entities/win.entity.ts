import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';

@Entity()
export class Win {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.wins)
  user: User;

  @ManyToOne(() => Word, word => word.wins)
  word: Word;

  @CreateDateColumn()
  createdAt: Date;
}