import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Attempt } from '../entities/attempt.entity';
import { User } from '../entities/user.entity';
import { WordsService } from '../words/words.service';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Attempt)
    private attemptRepository: Repository<Attempt>,
    private wordsService: WordsService,
  ) {}

  async compareWords(userId: number, userWord: string): Promise<any> {
    const currentWord = this.wordsService.getCurrentWord();
    if (!currentWord) {
      throw new BadRequestException('No hay palabra activa en este momento');
    }

    userWord = userWord.toUpperCase();
    if (userWord.length !== 5) {
      throw new BadRequestException('La palabra debe tener 5 letras');
    }

    // Obtener o crear el juego actual para el usuario
    let game = await this.getCurrentGame(userId);
    if (!game) {
      game = await this.createNewGame(userId);
    }

    // Verificar si el usuario ya usó sus 5 intentos
    const attempts = await this.attemptRepository.count({ where: { gameId: game.id } });
    if (attempts >= 5) {
      throw new BadRequestException('Ya has usado todos tus intentos para esta palabra');
    }

    // Comparar las palabras
    const result = this.compareLetters(userWord, currentWord.word);

    // Guardar el intento
    await this.saveAttempt(game.id, userWord, result);

    // Si adivinó la palabra, marcar como victoria
    if (userWord === currentWord.word) {
      await this.markGameAsWon(game.id);
    }

    return result;
  }

  private compareLetters(userWord: string, correctWord: string): Array<{letter: string, value: number}> {
    const result: Array<{letter: string, value: number}> = [];
    const wordArray = correctWord.split('');
    const userArray = userWord.split('');

    for (let i = 0; i < 5; i++) {
      if (userArray[i] === wordArray[i]) {
        result.push({ letter: userArray[i], value: 1 }); // Letra correcta, posición correcta
      } else if (wordArray.includes(userArray[i])) {
        result.push({ letter: userArray[i], value: 2 }); // Letra correcta, posición incorrecta
      } else {
        result.push({ letter: userArray[i], value: 3 }); // Letra no está en la palabra
      }
    }

    return result;
  }

  private async getCurrentGame(userId: number): Promise<Game | null> {
    return this.gameRepository.findOne({
      where: {
        userId,
        completed: false
      }
    });
  }

  private async createNewGame(userId: number): Promise<Game> {
    const game = this.gameRepository.create({
      userId,
      completed: false,
      won: false
    });
    return this.gameRepository.save(game);
  }

  private async saveAttempt(gameId: number, word: string, result: any[]): Promise<void> {
    const attempt = this.attemptRepository.create({
      gameId,
      word,
      result: JSON.stringify(result)
    });
    await this.attemptRepository.save(attempt);
  }

  private async markGameAsWon(gameId: number): Promise<void> {
    await this.gameRepository.update(gameId, {
      completed: true,
      won: true
    });
  }
}