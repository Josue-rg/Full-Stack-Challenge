import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from '../entities/word.entity';
import { Game } from '../entities/game.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { Win } from '../entities/win.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Word, Game, Win]),
    ScheduleModule.forRoot()
  ],
  providers: [WordsService],
  controllers: [WordsController],
  exports: [WordsService]
})
export class WordsModule {}
