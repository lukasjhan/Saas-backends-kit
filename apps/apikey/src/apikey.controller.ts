import { Controller, Get } from '@nestjs/common';
import { ApikeyService } from './apikey.service';

@Controller()
export class ApikeyController {
  constructor(private readonly apikeyService: ApikeyService) {}

  @Get()
  getHello(): string {
    return this.apikeyService.getHello();
  }
}
