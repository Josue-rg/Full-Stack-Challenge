import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Attempt } from '../entities/attempt.entity';
import { Win } from '../entities/win.entity';
import { User } from '../entities/user.entity';
import { Word } from '../entities/word.entity';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>,
    @InjectRepository(Win) private winRepo: Repository<Win>,
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Word) private wordRepo: Repository<Word>,
  ) {}

  async createGame(userId: string): Promise<Game> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    const game = this.gameRepo.create({ userId, user });
    await this.gameRepo.save(game);
    await this.userRepo.increment({ id: userId }, 'totalGames', 1);

    return game;
  }

  async createAttempt(gameId: number, word: string, result: string): Promise<Attempt> {
    const attempt = this.attemptRepo.create({ gameId, word, result });
    return this.attemptRepo.save(attempt);
  }

  async createWin(userId: string, wordId: number): Promise<Win> {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const word = await this.wordRepo.findOne({ where: { id: wordId } });
    if (!user || !word) throw new Error('User or Word not found');
    const win = this.winRepo.create({ user, word });
    await this.userRepo.increment({ id: userId }, 'totalWins', 1);
    return this.winRepo.save(win);
  }
}
