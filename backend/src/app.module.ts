import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    //Connection to the database
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'root',
    password: 'root',
    database: 'wordle_db',
    entities: [],
    synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
