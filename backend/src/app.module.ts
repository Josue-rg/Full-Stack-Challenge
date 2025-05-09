import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { WordsModule } from './words/words.module';
import { GameModule } from './game/game.module';
import { Word } from './entities/word.entity';
import { Game } from './entities/game.entity';
import { Attempt } from './entities/attempt.entity';
import { User } from './entities/user.entity';
import { Win } from './entities/win.entity';
import { AuthModule } from './auth/auth.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'wordle_db',
      entities: [Word, Game, Attempt, User, Win],
      synchronize: true,
    }),
    ScheduleModule.forRoot(),
    WordsModule,
    GameModule,
    AuthModule,
    StatsModule
  ],
})
export class AppModule {}
