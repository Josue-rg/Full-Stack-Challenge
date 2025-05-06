import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';
import { Attempt } from './attempt.entity';

    //los posibles estados de un juego
    export enum GameStatus {
    //en progreso (aun hay intentos disponibles)
    IN_PROGRESS = 'in_progress',
    // El juego ganado
    WON = 'won',    
    // El juego perdido
    LOST = 'lost'
    }

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.games)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @ManyToOne(() => Word, word => word.games)
  @JoinColumn({ name: 'wordId' })
  word: Word;

  @Column()
  wordId: string;

  @Column({
    type: 'enum',
    enum: GameStatus,
    default: GameStatus.IN_PROGRESS
  })
  status: GameStatus;

  @Column({ default: 0 })
  attempts: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  finishedAt: Date;

  @OneToMany(() => Attempt, attempt => attempt.game)
  attemptsList: Attempt[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}