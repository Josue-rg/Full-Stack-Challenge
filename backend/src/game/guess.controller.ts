import { Controller, Post, Body, UseGuards, Req, BadRequestException } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameService } from './game.service';
import { WordsService } from '../words/words.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Attempt } from '../entities/attempt.entity';

@UseGuards(JwtAuthGuard)
@Controller('guess')
export class GuessController {
  constructor(
    private readonly gameService: GameService,
    private readonly wordsService: WordsService,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>
  ) {}

  @Post()
  async guessWord(@Req() req, @Body() body: { word: string }) {
    const userId = req.user.userId;
    const guess = body.word?.toUpperCase();
    if (!guess || guess.length !== 5) {
      throw new BadRequestException('La palabra debe tener 5 letras');
    }

    // Obtener la palabra actual
    const currentWord = await this.wordsService.getCurrentWord();
    if (!currentWord || !currentWord.word) {
      throw new BadRequestException('No hay palabra activa');
    }

    // Obtener el juego activo del usuario para la palabra actual
    let game = await this.gameRepo.findOne({ where: { userId, completed: false } });
    if (!game) {
      game = await this.gameService.createGame(userId);
    }

    // Contar intentos actuales
    const attempts = await this.attemptRepo.count({ where: { gameId: game.id } });
    if (attempts >= 5) {
      throw new BadRequestException('Máximo de 5 intentos alcanzado para esta palabra');
    }

    // Lógica de comparación
    type LetterResult = { letter: string; value: number };
    const result: LetterResult[] = [];
    const used = Array(5).fill(false);
    for (let i = 0; i < 5; i++) {
      if (guess[i] === currentWord.word[i]) {
        result.push({ letter: guess[i], value: 1 });
        used[i] = true;
      } else {
        result.push({ letter: guess[i], value: 0 }); // placeholder, se actualizará después
      }
    }
    for (let i = 0; i < 5; i++) {
      if (result[i].value !== 0) continue;
      const index = currentWord.word.split('').findIndex((c, idx) => c === guess[i] && !used[idx]);
      if (index !== -1) {
        result[i] = { letter: guess[i], value: 2 };
        used[index] = true;
      } else {
        result[i] = { letter: guess[i], value: 3 };
      }
    }

    // Registrar intento
    await this.gameService.createAttempt(game.id, guess, JSON.stringify(result));

    // Si es correcta, marcar win y completar juego
    if (guess === currentWord.word) {
      await this.gameService.createWin(userId, currentWord.id);
      game.completed = true;
      game.won = true;
      await this.gameRepo.save(game);
    }

    return result;
  }
}
