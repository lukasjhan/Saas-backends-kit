import { Module } from '@nestjs/common';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [ApikeyController],
  providers: [ApikeyService],
})
export class ApikeyModule {}
