import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';
import { Attempt } from './attempt.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Word)
  word: Word;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  won: boolean;

  @OneToMany(() => Attempt, attempt => attempt.game)
  attempts: Attempt[];
}