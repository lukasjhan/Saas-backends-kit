import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { LogLevel } from '@prisma/client';

@Injectable()
export class LoggerService {
  constructor(private prisma: PrismaService) {}

  async log(level: LogLevel, message: string, category: string) {
    return this.prisma.log.create({
      data: {
        level,
        message,
        category,
      },
    });
  }

  async getLogs(filter: {
    level?: LogLevel;
    category?: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    return this.prisma.log.findMany({
      where: {
        level: filter.level,
        category: filter.category,
        timestamp: {
          gte: filter.startDate,
          lte: filter.endDate,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
