import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { WordsService } from './words.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('words')
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  async addWord(@Body() body: { word: string }) {
    return this.wordsService.addWord(body.word);
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  getCurrentWord() {
    return this.wordsService.getCurrentWord();
  }

  @Get('next-word-time')
  @UseGuards(JwtAuthGuard)
  getTimeUntilNextWord() {
    return {
      timeRemaining: this.wordsService.getTimeUntilNextWord()
    };
  }
}