import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { WordsService } from './words.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('words')
@UseGuards(JwtAuthGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  async addWord(@Body() body: { word: string }) {
    return this.wordsService.addWord(body.word);
  }

  @Get('current')
  getCurrentWord() {
    return this.wordsService.getCurrentWord();
  }

  @Get('next-word-time')
  getTimeUntilNextWord() {
    return {
      timeRemaining: this.wordsService.getTimeUntilNextWord()
    };
  }
}