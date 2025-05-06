import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Game } from './game.entity';
import { Win } from './win.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 5 })
  word: string;

  @Column({ default: false })
  used: boolean;

  @Column({ type: 'timestamp', nullable: true })
  usedAt: Date;

  @OneToMany(() => Game, game => game.word)
  games: Game[];

  // Relación Uno a Muchos con la entidad Win
  @OneToMany(() => Win, win => win.word)
  wins: Win[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}