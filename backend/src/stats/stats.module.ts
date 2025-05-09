import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import { Win } from '../entities/win.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Game, Win])],
  providers: [StatsService],
  controllers: [StatsController],
})
export class StatsModule {}
