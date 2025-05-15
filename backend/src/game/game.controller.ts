import { Controller, UseGuards, Post, Req, Body } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameService } from './game.service';
import { WordsService } from '../words/words.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from '../entities/game.entity';
import { Attempt } from '../entities/attempt.entity';

@UseGuards(JwtAuthGuard)
@Controller('api/games')
export class GameController {
  constructor(
    private readonly gameService: GameService,
    private readonly wordsService: WordsService,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
    @InjectRepository(Attempt) private attemptRepo: Repository<Attempt>
  ) {}
  
  @Post('start')
  @UseGuards(JwtAuthGuard)
  async startGame(@Req() req) {
    const userId = req.user.userId;
    if (!userId) {
      return {
        success: false,
        message: 'ID de usuario inválido'
      };
    }

    const result = await this.gameService.startGame(userId);
    
    if (result.gameId === undefined) {
      console.error('No se pudo iniciar el juego:', result.message);
      return {
        success: false,
        message: result.message
      };
    }
    
    return {
      success: true,
      gameId: result.gameId,
      wordLength: result.wordLength
    };
  }
  
  @Post('attempt')
  async checkAttempt(@Req() req, @Body() body: { gameId: number, word: string }) {
    
    const userId = req.user.userId || req.user.id;
    if (!userId) {
      console.error('Error: User ID not found', { user: req.user });
      throw new Error('User ID not found');
    }
    
    const game = await this.gameRepo.findOne({
      where: { id: body.gameId, userId: userId.toString() }
    });
    
    if (!game) {
      console.error('Error: Game not found or not authorized', { userId, gameId: body.gameId });
      throw new Error('Game not found or not authorized');
    }
    
    return this.gameService.checkAttempt(body.gameId, body.word);
  }
  
}