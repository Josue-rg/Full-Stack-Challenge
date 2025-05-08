import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/word.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class WordsService {
  private currentWord: Word | undefined;
  private lastWordSelectedAt: Date | undefined;

  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
  ) {
    // Seleccionar una palabra al inicio
    this.selectNewWord();
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

  @Cron(CronExpression.EVERY_5_MINUTES)
  async selectNewWord() {
    try {
      const word = await this.wordsRepository
        .createQueryBuilder('word')
        .where('word.used = :used', { used: false })
        .orderBy('RANDOM()')
        .take(1)
        .getOne();

      if (word) {
        if (this.currentWord) {
          await this.wordsRepository.update(this.currentWord.id, { used: true, usedAt: new Date() });
        }
        this.currentWord = word;
        this.lastWordSelectedAt = new Date();
      }
    } catch (error) {
      console.error('Error al seleccionar nueva palabra:', error);
    }
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