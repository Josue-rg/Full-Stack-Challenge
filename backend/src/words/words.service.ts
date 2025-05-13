import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/word.entity';
import { Game } from '../entities/game.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WordsService {
  private currentWord: Word | undefined;
  private lastWordSelectedAt: Date | undefined;

  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
  ) {
    this.selectNewWord();
setInterval(() => this.selectNewWord(), 300000);
  }

  async addWord(word: string): Promise<Word> {
    if (!word || word.length !== 5) {
      throw new Error('La palabra debe tener exactamente 5 letras');
    }
    
    const newWord = this.wordsRepository.create({
      word: word.toUpperCase(),
      used: false,
    });
    
    return this.wordsRepository.save(newWord);
  }

  async findWord(word: string): Promise<Word | undefined> {
    const found = await this.wordsRepository.findOne({ where: { word: word.toUpperCase() } });
    return found ?? undefined;
  }

  @Cron(CronExpression.EVERY_5_MINUTES)
  async selectNewWord() {
      await this.gameRepository.createQueryBuilder()
        .update()
        .set({ completed: true })
        .where('completed = :completed', { completed: false })
        .execute();

      let word = await this.wordsRepository
        .createQueryBuilder('word')
        .where('word.used = :used', { used: false })
        .orderBy('RANDOM()')
        .take(1)
        .getOne();

      if (!word) {
        try {
          await this.wordsRepository.createQueryBuilder()
            .update()
            .set({ used: false })
            .execute();
          word = await this.wordsRepository
            .createQueryBuilder('word')
            .orderBy('RANDOM()')
            .take(1)
            .getOne();
        } catch (error) {
          return;
        }
      }

      if (word) {
        if (this.currentWord) {
          await this.wordsRepository.update(this.currentWord.id, { used: true, usedAt: new Date() });
        }
        this.currentWord = word;
        this.lastWordSelectedAt = new Date();
      }
    }

  async getAllWords(): Promise<Word[]> {
    return this.wordsRepository.find();
  }

  getCurrentWord(): Word {
    if (!this.currentWord) {
      throw new NotFoundException('No hay palabra seleccionada actualmente');
    }
    return this.currentWord;
  }

  getTimeUntilNextWord(): number {
    if (!this.lastWordSelectedAt) return 0;
    const now = new Date();
    const diff = 300000 - (now.getTime() - this.lastWordSelectedAt.getTime());
    return Math.max(0, diff);
  }
}