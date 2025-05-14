import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Word } from '../entities/word.entity';
import { Game } from '../entities/game.entity';
import { Win } from '../entities/win.entity';

@Injectable()
export class WordsService {
  private currentWord: Word | undefined;
  private lastWordSelectedAt: Date | undefined;

  constructor(
    @InjectRepository(Word)
    private wordsRepository: Repository<Word>,
    @InjectRepository(Game)
    private gameRepository: Repository<Game>,
    @InjectRepository(Win)
    private winRepository: Repository<Win>,
  ) {
    this.initializeWord();
    setInterval(() => this.initializeWord(), 300000);
  }

  private async initializeWord() {
    await this.gameRepository.createQueryBuilder()
      .update()
      .set({ completed: true })
      .where('completed = :completed', { completed: false })
      .execute();
    const word = await this.wordsRepository
      .createQueryBuilder('word')
      .orderBy('RANDOM()')
      .take(1)
      .getOne();

    if (word) {
      this.currentWord = word;
      this.lastWordSelectedAt = new Date();
      console.log('Nueva palabra seleccionada:', word.word);
    }
  }

  async selectNewWord(userId?: string) {
    if (!userId) {
      throw new NotFoundException('Usuario no proporcionado');
    }

    // Obtener las palabras ya ganadas por el usuario
    const wonWords = await this.winRepository
      .createQueryBuilder('win')
      .select('win.word.id')
      .where('win.user.id = :userId', { userId })
      .getMany();

    const wonWordIds = wonWords.map(win => win.word.id);
    
    let queryBuilder = this.wordsRepository.createQueryBuilder('word');
    if (wonWordIds.length > 0) {
      queryBuilder = queryBuilder.where('word.id NOT IN (:...wonWordIds)', { wonWordIds });
    }

    let word = await queryBuilder
      .orderBy('RANDOM()')
      .take(1)
      .getOne();

    if (!word) {
      word = await this.wordsRepository
        .createQueryBuilder('word')
        .orderBy('RANDOM()')
        .take(1)
        .getOne();
    }

    if (word) {
      this.currentWord = word;
      this.lastWordSelectedAt = new Date();
      console.log('Nueva palabra seleccionada para usuario:', word.word);
    }

    return word;
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
    const nextWordTime = new Date(this.lastWordSelectedAt);
    nextWordTime.setMinutes(nextWordTime.getMinutes() + 5);
    const diff = nextWordTime.getTime() - now.getTime();
    return Math.max(0, diff);
  }
}
