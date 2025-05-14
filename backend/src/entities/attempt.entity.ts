import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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

  @ManyToOne(() => Game, game => game.attempts)
  game: Game;
}