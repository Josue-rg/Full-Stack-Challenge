import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Attempt } from './attempt.entity';

@Entity()
export class Game {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: false })
  won: boolean;

  @ManyToOne(() => User, user => user.games)
  user: User;

  @OneToMany(() => Attempt, attempt => attempt.game)
  attempts: Attempt[];
}