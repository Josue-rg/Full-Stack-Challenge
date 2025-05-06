import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Game } from './game.entity';
import { Win } from './win.entity';

@Entity()
export class User {

  //generado automáticamente tipo UUID
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
  
  //Relación Uno a Muchos
  //Como acceder al usuario desde la entidad Game (game.user)
  @OneToMany(() => Game, game => game.user)
  games: Game[];

  // Relación Uno a Muchos con la entidad Win
  @OneToMany(() => Win, win => win.user)
  wins: Win[];

  // Columna "createdAt" que guarda la fecha y hora en la que se creó el usuario
  //por defecto fecha/hora actual (CURRENT_TIMESTAMP)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}