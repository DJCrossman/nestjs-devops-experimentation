import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConsumer } from './app.consumer';
import { AppController } from './app.controller';
import { AppProducer } from './app.producer';
import { AppService } from './app.service';
import { BullOptions } from './bull.config';
import { HealthService } from './shared/application/health/health.service';
import TypeOrmConfig from './typeorm.config';

@Module({
  imports: [
    BullModule.registerQueue(BullOptions),
    TypeOrmModule.forRoot(TypeOrmConfig),
    HttpModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppProducer, AppConsumer, HealthService],
})
export class AppModule {}
