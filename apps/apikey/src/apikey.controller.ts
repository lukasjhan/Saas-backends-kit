import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ApikeyService } from './apikey.service';

@Controller()
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}

  @MessagePattern({ cmd: 'apikey.create' })
  createApiKey(@Payload() data: { userId: string; name: string }) {
    return this.apikeyService.createApiKey(data.userId, data.name);
  }

  @MessagePattern({ cmd: 'apikey.validate' })
  validateApiKey(@Payload() key: string) {
    return this.apikeyService.validateApiKey(key);
  }

  @MessagePattern({ cmd: 'apikey.deactivate' })
  deactivateApiKey(@Payload() key: string) {
    return this.apikeyService.deactivateApiKey(key);
  }
}
