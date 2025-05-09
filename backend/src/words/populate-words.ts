import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { WordsService } from './words.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const wordsService = app.get(WordsService);

  const words = ['GATOS', 'LIMON', 'PERRO', 'SALTA', 'RATON'];
  for (const word of words) {
    try {
      await wordsService.addWord(word);
      console.log(`Palabra agregada: ${word}`);
    } catch (e) {
      console.log(`Error agregando ${word}:`, e.message);
    }
  }
  await app.close();
}

bootstrap();
