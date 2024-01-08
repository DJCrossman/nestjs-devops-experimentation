import { Injectable } from '@nestjs/common';
import {
  DiskHealthIndicator,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { Logger } from '../../utils/winston.logger';

@Injectable()
export class HealthService {
  constructor(
    private healthCheck: HealthCheckService,
    private httpIndicator: HttpHealthIndicator,
    private typeOrmIndicator: TypeOrmHealthIndicator,
    private memoryIndicator: MemoryHealthIndicator,
    private diskIndicator: DiskHealthIndicator,
  ) {}

  // On a machine with 4GB of memory, consider setting this to 3758 (3.5GB) to leave some memory for other uses and avoid swapping.
  private maxMemory = 3758 * 1024 * 1024;
  private maxTimeout = 3000;
  private storageThreshold = 0.95;

  async check(): Promise<HealthCheckResult> {
    let data: HealthCheckResult;
    try {
      data = await this.healthCheck.check([
        () =>
          this.httpIndicator.pingCheck('google', 'https://google.com', {
            timeout: this.maxTimeout,
          }),
        () =>
          this.httpIndicator.pingCheck('facebook', 'https://facebook.com', {
            timeout: this.maxTimeout,
          }),
        () =>
          this.httpIndicator.pingCheck('netflix', 'https://netflix.com', {
            timeout: this.maxTimeout,
          }),
        () =>
          this.httpIndicator.pingCheck('stripe', 'https://stripe.com', {
            timeout: this.maxTimeout,
          }),
        () =>
          this.typeOrmIndicator.pingCheck('database', {
            timeout: this.maxTimeout,
          }),
        () => this.memoryIndicator.checkHeap('memory_heap', this.maxMemory),
        () => this.memoryIndicator.checkRSS('memory_rss', this.maxMemory),
        () =>
          this.diskIndicator.checkStorage('storage', {
            thresholdPercent: this.storageThreshold,
            path: '/',
          }),
      ]);
    } catch (e) {
      Logger.warn(`Failed health check due to: ${e.message}`, 'AppController');
      data = e.response || { status: 'error', details: {} };
      if (data.error?.google) {
        Logger.error(
          `Failed health check due to ping 'https://google.com' has exceeded [${this.maxTimeout} ms]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.facebook) {
        Logger.error(
          `Failed health check due to ping 'https://facebook.com' has exceeded [${this.maxTimeout} ms]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.netflix) {
        Logger.error(
          `Failed health check due to ping 'https://netflix.com' has exceeded [${this.maxTimeout} ms]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.stripe) {
        Logger.error(
          `Failed health check due to ping 'https://stripe.com' has exceeded [${this.maxTimeout} ms]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.database) {
        Logger.error(
          `Failed health check due to ping database has exceeded [${this.maxTimeout} ms]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.memory_heap) {
        const heap =
          Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) /
          100;
        Logger.error(
          `Failed health check due to memory heap has exceeded the given threshold [${heap} / 3.5 GB ]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.memory_rss) {
        const heap =
          Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100;
        Logger.error(
          `Failed health check due to memory rss has exceeded the given threshold [${heap} / 3.5 GB ]`,
          undefined,
          'AppController',
        );
      }
      if (data.error?.storage) {
        Logger.error(
          `Failed health check due to used disk storage exceeded the set threshold [${
            this.storageThreshold * 100
          } % ]`,
          undefined,
          'AppController',
        );
      }
    }
    return data;
  }
}
