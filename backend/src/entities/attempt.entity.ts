import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne } from 'typeorm';
import { Game } from './game.entity';

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  word: string;

  @Column('text')
  result: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Game, game => game.attempts)
  game: Game;
}