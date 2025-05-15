import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from '../entities/game.entity';
import { Attempt } from '../entities/attempt.entity';
import { Win } from '../entities/win.entity';
import { User } from '../entities/user.entity';
import { Word } from '../entities/word.entity';
import { GameService } from './game.service';
import { GameController } from './game.controller';
import { WordsService } from '../words/words.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Attempt, Win, User, Word])],
  providers: [GameService, WordsService],
  controllers: [GameController],
})
export class GameModule {}
