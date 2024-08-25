import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { LoggingInterceptor } from './interceptors/logging.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [HttpExceptionFilter, LoggingInterceptor],
  exports: [PrismaModule, HttpExceptionFilter, LoggingInterceptor],
})
export class CommonModule {}
