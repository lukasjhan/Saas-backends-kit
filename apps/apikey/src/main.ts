import { NestFactory } from '@nestjs/core';
import { ApikeyModule } from './apikey.module';

async function bootstrap() {
  const app = await NestFactory.create(ApikeyModule);
  await app.listen(3000);
}
bootstrap();
