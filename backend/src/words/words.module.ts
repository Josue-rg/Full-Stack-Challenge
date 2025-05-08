import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WordsService } from './words.service';
import { WordsController } from './words.controller';
import { Word } from '../entities/word.entity';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Word]),
    ScheduleModule.forRoot()
  ],
  providers: [WordsService],
  controllers: [WordsController],
  exports: [WordsService]
})
export class WordsModule {}