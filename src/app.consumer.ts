import { Process, Processor } from '@nestjs/bull';
import { Logger } from './shared/utils/winston.logger';

@Processor('default')
export class AppConsumer {
  @Process()
  async transcode(job): Promise<void> {
    Logger.log('Start transcoding...', 'AppConsumer');
    Logger.log(job, 'AppConsumer');
  }
}
