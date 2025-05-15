import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository} from 'typeorm';
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

  async startGame(userId: string): Promise<{
    gameId?: number;
    message?: string;
    wordLength?: number;
    currentWord?: string;
  }> {
    const wonWords = await this.winRepo.find({ 
      where: { user: { id: userId } as any },
      relations: ['word', 'user']
    });
    const wonWordIds = wonWords.map(win => win.word.id);
    
    const availableWord = await this.wordRepo
      .createQueryBuilder('word')
      .where(wonWordIds.length > 0 ? 'word.id NOT IN (:...wonWordIds)' : '1=1', { wonWordIds })
      .orderBy('RANDOM()')
      .getOne();

    if (!availableWord) {
      return {
        gameId: undefined,
        message: 'Lo sentimos, ya has adivinado todas las palabras disponibles. ¡Vuelve pronto!'
      };
    }

    console.log('Palabra a adivinar:', availableWord.word.toUpperCase());

    const game = this.gameRepo.create({
      userId: userId.toString(),
      word: availableWord,
      completed: false,
      won: false,
      attempts: []
    });
    
    const savedGame = await this.gameRepo.save(game);
    return {
      gameId: savedGame.id,
      wordLength: savedGame.word.word.length,
      currentWord: savedGame.word.word.toUpperCase()
    };
}

async checkAttempt(gameId: number, attemptWord: string) {
    const game = await this.gameRepo.findOne({
      where: { id: gameId },
      relations: ['word', 'attempts']
    });

    if (!game) {
      console.error('Juego no encontrado:', gameId);
      throw new Error('Game not found');
    }

    if (attemptWord.length !== 5) {
      console.error('Intento inválido:', attemptWord);
      throw new Error('Attempt must be 5 letters long');
    }

    const correctWord = game.word.word.toLowerCase();
    const attempt = attemptWord.toLowerCase();

    const feedback: number[] = new Array(5).fill(3);
    const correctWordChars = correctWord.split('');
    const attemptChars = attempt.split('');

    for (let i = 0; i < 5; i++) {
      if (attemptChars[i] === correctWordChars[i]) {
        feedback[i] = 1;
        correctWordChars[i] = '';
        attemptChars[i] = '';
      }
    }

    for (let i = 0; i < 5; i++) {
      if (attemptChars[i] !== '') {
        const index = correctWordChars.indexOf(attemptChars[i]);
        if (index !== -1) {
          feedback[i] = 2;
          correctWordChars[index] = '';
        }
      }
    }

    const attemptRecord = this.attemptRepo.create({
      gameId: gameId,
      word: attemptWord,
      result: JSON.stringify(feedback)
    });

    const isWon = feedback.every(val => val === 1);

    if (!game.attempts) {
      game.attempts = [];
    }
    game.attempts.push(attemptRecord);
    
    const user = await this.userRepo.findOne({ where: { id: game.userId } });
    
    if (user) {
      if (isWon || game.attempts.length >= 5) {
        user.totalGames += 1;
        
        if (isWon) {
          user.totalWins += 1;
          game.completed = true;
          game.won = true;
          
          const winRecord = this.winRepo.create({
            user,
            word: game.word
          });
          await this.winRepo.save(winRecord);
        } else if (game.attempts.length >= 5) {
          game.completed = true;
          game.won = false;
        }
        
        await this.userRepo.save(user);
      }
    }

    await this.attemptRepo.save(attemptRecord);
    await this.gameRepo.save(game);

    return {
      feedback,
      isWon,
      gameCompleted: game.completed,
      attempts: game.attempts.length,
      attemptsLeft: 5 - game.attempts.length
    };
  }
}