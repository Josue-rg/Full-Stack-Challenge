import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { GameService } from './game.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('game')
@UseGuards(JwtAuthGuard)
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post('guess')
  async guessWord(@Request() req, @Body() body: { word: string }) {
    return this.gameService.compareWords(req.user.id, body.word);
  }
}