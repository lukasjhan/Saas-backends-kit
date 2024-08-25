import { Injectable } from '@nestjs/common';

@Injectable()
export class ApikeyService {
  getHello(): string {
    return 'Hello World!';
  }
}
