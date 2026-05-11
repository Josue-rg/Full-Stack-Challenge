import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DB_CONNECTION_STRING'),
        entities: [Word, Game, Attempt, User, Win],
        synchronize: true, // Siempre true para desarrollo y producción (ajusta según necesites)
        ssl: {
          rejectUnauthorized: false
        },
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    WordsModule,
    GameModule,
    AuthModule,
    StatsModule
  ],
})
export class AppModule {}
