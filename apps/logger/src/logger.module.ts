import { Module } from '@nestjs/common';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [LoggerController],
  providers: [LoggerService],
})
export class LoggerModule {}
