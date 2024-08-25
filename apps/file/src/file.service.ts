import { Injectable } from '@nestjs/common';
import { PrismaService } from '@app/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from 'fs/promises';

@Injectable()
export class FileManagementService {
  constructor(private prisma: PrismaService) {}

  async uploadFile(file: Express.Multer.File, userId: string) {
    const { filename, path, mimetype, size } = file;
    return this.prisma.file.create({
      data: {
        filename,
        path,
        mimetype,
        size,
        userId,
      },
    });
  }

  async getFileStream(fileId: number) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error('File not found');
    }
    return createReadStream(join(process.cwd(), file.path));
  }

  async deleteFile(fileId: number) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });
    if (!file) {
      throw new Error('File not found');
    }
    await fs.unlink(join(process.cwd(), file.path));
    return this.prisma.file.delete({ where: { id: fileId } });
  }

  async getFilesList(userId: string) {
    return this.prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
