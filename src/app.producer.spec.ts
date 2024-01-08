import { createMock } from '@golevelup/ts-jest';
import { getQueueToken } from '@nestjs/bull';
import { Test } from '@nestjs/testing';
import { Queue } from 'bull';
import { AppProducer } from './app.producer';

describe('AppProducer', () => {
  let producer: AppProducer;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AppProducer,
        { provide: getQueueToken('default'), useValue: createMock<Queue>() },
      ],
    }).compile();

    producer = module.get<AppProducer>(AppProducer);
  });

  it('should be defined', () => {
    expect(producer).toBeDefined();
  });
});
