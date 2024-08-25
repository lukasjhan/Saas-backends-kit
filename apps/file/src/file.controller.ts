import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { FileManagementService } from './file.service';

@Controller()
export class FileManagementController {
  constructor(private readonly fileManagementService: FileManagementService) {}

  @MessagePattern({ cmd: 'file.upload' })
  uploadFile(@Payload() data: { file: Express.Multer.File; userId: string }) {
    return this.fileManagementService.uploadFile(data.file, data.userId);
  }

  @MessagePattern({ cmd: 'file.getStream' })
  getFileStream(@Payload() fileId: number) {
    return this.fileManagementService.getFileStream(fileId);
  }

  @MessagePattern({ cmd: 'file.delete' })
  deleteFile(@Payload() fileId: number) {
    return this.fileManagementService.deleteFile(fileId);
  }

  @MessagePattern({ cmd: 'file.getList' })
  getFilesList(@Payload() userId: string) {
    return this.fileManagementService.getFilesList(userId);
  }
}
