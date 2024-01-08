import {
  DiskHealthIndicator,
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  TerminusModule,
} from '@nestjs/terminus';
import { Test, TestingModule } from '@nestjs/testing';
import { HealthService } from './health.service';

describe('HealthService', () => {
  let service: HealthService;
  let healthCheck: HealthCheckService;
  let httpIndicator: HttpHealthIndicator;
  let memoryIndicator: MemoryHealthIndicator;
  let diskIndicator: DiskHealthIndicator;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      providers: [HealthService],
    }).compile();

    service = module.get<HealthService>(HealthService);
    healthCheck = module.get<HealthCheckService>(HealthCheckService);
    httpIndicator = await module.resolve<HttpHealthIndicator>(
      HttpHealthIndicator,
    );
    memoryIndicator = module.get<MemoryHealthIndicator>(MemoryHealthIndicator);
    diskIndicator = module.get<DiskHealthIndicator>(DiskHealthIndicator);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(healthCheck).toBeDefined();
    expect(httpIndicator).toBeDefined();
    expect(memoryIndicator).toBeDefined();
    expect(diskIndicator).toBeDefined();
  });
});
