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
  ) {}

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

  async getAllWords(): Promise<Word[]> {
    return this.wordsRepository.find();
  }

  getCurrentWord(): Word {
    if (!this.currentWord) {
      throw new NotFoundException('No hay palabra seleccionada actualmente');
    }
    return this.currentWord;
  }
  
  async selectWordForUser(userId: string): Promise<Word> {
    if (!userId) {
      throw new NotFoundException('Usuario no proporcionado');
    }

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
    
    if (!word) {
      throw new NotFoundException('No hay palabras disponibles');
    }
    
    console.log('Nueva palabra seleccionada para usuario:', word.word);
    return word;
  }

  async findWord(word: string): Promise<Word | undefined> {
    const found = await this.wordsRepository.findOne({ 
      where: { word: word.toUpperCase() } 
    });
    return found ?? undefined;
  }

  async getUserStats(userId: string) {
    const totalWords = await this.wordsRepository.count();
    const wonWords = await this.winRepository.count({ 
      where: { user: { id: userId } } 
    });
    const gamesPlayed = await this.gameRepository.count({ 
      where: { userId } 
    });
    const gamesWon = await this.gameRepository.count({ 
      where: { userId, won: true } 
    });
    
    return {
      totalWords,
      wonWords,
      wordsRemaining: totalWords - wonWords,
      gamesPlayed,
      gamesWon,
      winRate: gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0
    };
  }
}