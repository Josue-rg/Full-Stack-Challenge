import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('api/stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @UseGuards(JwtAuthGuard)
  @Get('games') 
  async getTotalGames(@Req() req) {
    const userId = req.user.userId;
    const totalGames = await this.statsService.getTotalGames(userId);
    return { totalGames };
  }

  @UseGuards(JwtAuthGuard)
  @Get('wins')
  async getTotalWins(@Req() req) {
    const userId = req.user.userId;
    const totalWins = await this.statsService.getTotalWins(userId);
    return { totalWins };
  }

  @Get('top-users')
  async getUsers() {
    const users = await this.statsService.getTopUsers();
    if (users.length === 0) {
      return { message: "Aún no hay usuarios con victorias" };
    }
    return users;
  }

  @Get('popular-words')
  async getPopularWords() {
    const words = await this.statsService.getMostGuessedWords();
    if (words.length === 0) {
      return { message: "Aún no hay palabras adivinadas" };
    }
    return words;
  }
}