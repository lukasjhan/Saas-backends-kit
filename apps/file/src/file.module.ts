import { Module } from '@nestjs/common';
import { FileManagementController } from './file.controller';
import { FileManagementService } from './file.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [FileManagementController],
  providers: [FileManagementService],
})
export class FileManagementModule {}
