import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ApikeyService {
  constructor(private prisma: PrismaService) {}

  async createApiKey(userId: string, name: string) {
    const uuid = uuidv4().replace(/-/g, '');
    const key = `apikey-${uuid}`;
    return this.prisma.apiKey.create({
      data: {
        key,
        name,
        userId,
      },
    });
  }

  async getApiKey(key: string) {
    return this.prisma.apiKey.findUnique({
      where: { key },
    });
  }

  async validateApiKey(key: string) {
    const apiKey = await this.getApiKey(key);
    return apiKey && apiKey.isActive;
  }

  async deactivateApiKey(key: string) {
    return this.prisma.apiKey.update({
      where: { key },
      data: { isActive: false },
    });
  }
}
