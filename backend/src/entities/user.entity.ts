import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Game } from './game.entity';
import { Win } from './win.entity';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ default: 0 })
  totalGames: number;

  @Column({ default: 0 })
  totalWins: number;
  
  @OneToMany(() => Game, game => game.user)
  games: Game[];

  @OneToMany(() => Win, win => win.user)
  wins: Win[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}