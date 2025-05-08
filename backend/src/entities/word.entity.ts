import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Win } from './win.entity';

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 5 })
  word: string;

  @Column({ default: false })
  used: boolean;

  @Column({ nullable: true })
  usedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Win, win => win.word)
  wins: Win[];
}