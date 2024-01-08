import { BullModuleOptions } from '@nestjs/bull';
import 'dotenv/config';

export const BullOptions: BullModuleOptions = {
  name: 'default',
  redis: {
    host: process.env.REDIS_QUEUE_HOST,
    port: Number(process.env.REDIS_QUEUE_PORT),
  },
  defaultJobOptions: {
    removeOnComplete: true,
  },
};

const ModuleOptions: BullModuleOptions[] = [BullOptions];

export default ModuleOptions;
