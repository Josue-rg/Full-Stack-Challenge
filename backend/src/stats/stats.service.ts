import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import { Win } from '../entities/win.entity';
import { Word } from '../entities/word.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Win) private winRepo: Repository<Win>,
    @InjectRepository(Word) private wordRepo: Repository<Word>
  ) {}

  async getTotalGames(userId: string): Promise<number> {
    return await this.gameRepo.count({ where: { userId } });
  }

  async getTotalWins(userId: string): Promise<number> {
    return await this.winRepo.count({ where: { user: { id: userId } } });
  }

  async getTopUsers(): Promise<{ username: string; totalWins: number }[]> {
    return this.userRepo.createQueryBuilder('user')
      .select(['user.username', 'user.totalWins'])
      .orderBy('user.totalWins', 'DESC')
      .limit(10)
      .getRawMany();
  }

  async getMostGuessedWords(): Promise<{ word: string; totalGuesses: number }[]> {
    return this.winRepo.createQueryBuilder('win')
      .select(['word.word as word', 'COUNT(win.id) as totalGuesses'])
      .leftJoin('win.word', 'word')
      .groupBy('word.id, word.word')
      .orderBy('totalGuesses', 'DESC')
      .limit(10)
      .getRawMany();
  }
}