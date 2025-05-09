import { Controller, Post, Body, Param, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GameService } from './game.service';

@UseGuards(JwtAuthGuard)
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async createGame(@Req() req) {
    const userId = req.user.userId;
    return this.gameService.createGame(userId);
  }

  @Post(':gameId/attempts')
  async createAttempt(
    @Param('gameId') gameId: number,
    @Body() body: { word: string; result: string }
  ) {
    return this.gameService.createAttempt(gameId, body.word, body.result);
  }

  @Post(':gameId/win')
  async createWin(
    @Req() req,
    @Param('gameId') gameId: number,
    @Body() body: { wordId: number }
  ) {
    const userId = req.user.userId;
    return this.gameService.createWin(userId, body.wordId);
  }
}
