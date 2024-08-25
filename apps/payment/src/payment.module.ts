import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { CommonModule } from '@app/common';

@Module({
  imports: [CommonModule],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
