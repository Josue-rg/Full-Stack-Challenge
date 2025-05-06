import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Game } from './game.entity';

    export enum LetterStatus {
        //posición correcta
        CORRECT = 1,
        //posición incorrecta
        WRONG_POSITION = 2,
        //no esta en la palabra
        NOT_IN_WORD = 3
    }

@Entity()
export class Attempt {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Game, game => game.attemptsList)
  @JoinColumn({ name: 'gameId' })
  game: Game;

  @Column()
  gameId: string;

  @Column({ length: 5 })
  word: string;

  @Column('jsonb')
  result: Array<{
    letter: string;
    value: LetterStatus;
  }>;

  @Column({ type: 'boolean' })
  isCorrect: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}