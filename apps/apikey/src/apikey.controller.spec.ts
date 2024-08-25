import { Test, TestingModule } from '@nestjs/testing';
import { ApikeyController } from './apikey.controller';
import { ApikeyService } from './apikey.service';

describe('ApikeyController', () => {
  let apikeyController: ApikeyController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ApikeyController],
      providers: [ApikeyService],
    }).compile();

    apikeyController = app.get<ApikeyController>(ApikeyController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(apikeyController.getHello()).toBe('Hello World!');
    });
  });
});
