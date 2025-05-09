import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('games')
  async getTotalGames(@Req() req) {
    const userId = req.user.userId;
    const totalGames = await this.statsService.getTotalGames(userId);
    return { totalGames };
  }

  @Get('wins')
  async getTotalWins(@Req() req) {
    const userId = req.user.userId;
    const totalWins = await this.statsService.getTotalWins(userId);
    return { totalWins };
  }

  @Get('ranking')
  async getRanking() {
    return this.statsService.getTop10Players();
  }

  @Get('popular-words')
  async getPopularWords() {
    return this.statsService.getMostGuessedWords();
  }
}
