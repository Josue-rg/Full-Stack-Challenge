import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.games)
  user: User;

  @OneToMany(() => Attempt, attempt => attempt.game)
  attempts: Attempt[];
}