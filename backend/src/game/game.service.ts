import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan, Equal } from 'typeorm';
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

  
  async getCurrentActiveWord() {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const activeWord = await this.wordRepo.findOne({
      where: { used: true, usedAt: MoreThan(fiveMinutesAgo) },
      order: { usedAt: 'DESC' }
    });

    return activeWord;
  }

  async startGame(userId: string): Promise<{
    gameId?: number;
    message?: string;
    wordLength?: number;
    currentWord?: string;
  }> {
    const activeWord = await this.getCurrentActiveWord();
    
    if (activeWord) {
      const game = this.gameRepo.create({
        userId: userId.toString(),
        word: activeWord,
        completed: false,
        won: false,
        attempts: []
      });
      const savedGame = await this.gameRepo.save(game);
      console.log("palbra", savedGame.word)
      return {
        gameId: savedGame.id,
        wordLength: savedGame.word.word.length,
        currentWord: savedGame.word.word.toUpperCase()
      };
    }

    const allWords = await this.wordRepo.find({
      where: { used: false }
    });
    const wonWords = await this.winRepo.find({ 
      where: { user: { id: userId } as any },
      relations: ['word', 'user']
    });
    const wonWordTexts = wonWords.map(win => win.word.word);
    const availableWords = allWords.filter(word => !wonWordTexts.includes(word.word));
    
    if (availableWords.length === 0) {
      const refreshedWords = await this.wordRepo.find({
        where: { used: false }
      });
      
      if (refreshedWords.length === 0) {
        return {
          gameId: undefined,
          message: 'Lo sentimos, no hay más palabras disponibles por ahora. ¡Vuelve pronto!'
        };
      }
      
      const selectedWord = refreshedWords[Math.floor(Math.random() * refreshedWords.length)];
      console.log(`🎲 PALABRA PARA ADIVINAR: ${selectedWord.word}`);
      selectedWord.used = true;
      selectedWord.usedAt = new Date();
      await this.wordRepo.save(selectedWord);
      
      const game = this.gameRepo.create({
        userId: userId.toString(),
        word: selectedWord,
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
    
    const selectedWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    
    console.log(`🎲 PALABRA PARA ADIVINAR: ${selectedWord.word.toUpperCase()}`);
    
    selectedWord.used = true;
    selectedWord.usedAt = new Date();
    await this.wordRepo.save(selectedWord);
    const game = this.gameRepo.create({
      userId: userId.toString(),
      word: selectedWord,
      completed: false,
      won: false,
      attempts: []
    });
    
    const savedGame = await this.gameRepo.save(game);
    console.log(`🎲 Palabra seleccionada: ${savedGame.word.word.toUpperCase()}`);
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

    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    if (game.word.usedAt < fiveMinutesAgo) {
      console.error('Palabra expirada:', game.word.word);
      throw new Error('Word has expired. Start a new game.');
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
    
    // Primero verificar si ganó
    if (isWon) {
      game.completed = true;
      game.won = true;
      
      // Crear registro de victoria
      const user = await this.userRepo.findOne({ where: { id: game.userId } });
      if (user) {
        const winRecord = this.winRepo.create({
          user,
          word: game.word
        });
        await this.winRepo.save(winRecord);
      }
    } else if (game.attempts.length >= 5) {
      game.completed = true;
      game.won = false;
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