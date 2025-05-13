import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import { Win } from '../entities/win.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Win) private winRepo: Repository<Win>
  ) {}

  async getTotalGames(userId: string): Promise<number> {
    try {
      return await this.gameRepo.count({ where: { userId } });
    } catch (error) {
      console.error('Error en getTotalGames:', error);
      throw error;
    }
  }

  async getTotalWins(userId: string): Promise<number> {
    try {
      return await this.winRepo.count({ where: { user: { id: userId } } });
    } catch (error) {
      console.error('Error en getTotalWins:', error);
      throw error;
    }
  }

  async getTop10Players(): Promise<{ username: string; totalWins: number }[]> {
    return this.userRepo.createQueryBuilder('user').select(['user.username', 'user.totalWins']).orderBy('user.totalWins', 'DESC').limit(10).getRawMany();
  }

  async getMostGuessedWords(): Promise<{ word: string; winCount: number }[]> {
    return this.winRepo.createQueryBuilder('win')
      .leftJoin('win.word', 'word')
      .select('word.word', 'word')
      .addSelect('COUNT(win.id)', 'winCount')
      .groupBy('word.word')
      .orderBy('COUNT(win.id)', 'DESC')
      .limit(10)
      .getRawMany();
  }
}
