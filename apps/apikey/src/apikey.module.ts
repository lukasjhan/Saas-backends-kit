import { Module } from '@nestjs/common';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';

@Module({
  imports: [],
  controllers: [ApikeyController],
  providers: [ApikeyService],
})
export class ApikeyModule {}
