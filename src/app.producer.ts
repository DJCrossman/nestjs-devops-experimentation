import { InjectQueue } from '@nestjs/bull';
import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AppProducer implements OnModuleDestroy {
  constructor(
    @InjectQueue('default')
    private queue: Queue,
  ) {}

  async onModuleDestroy() {
    await this.queue.close();
  }
}
