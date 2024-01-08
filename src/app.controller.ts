import { Controller, Get, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppService } from './app.service';
import { HealthService } from './shared/application/health/health.service';
import { ISuccessResponse } from './shared/dtos/success-response';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly healthService: HealthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<ISuccessResponse> {
    const data = await this.healthService.check();
    let code: number;
    let message: string;
    switch (data.status) {
      case 'ok':
        code = 200;
        message = `Looks like you've found a healthy service.`;
        break;
      case 'shutting_down':
      case 'error':
      default:
        const externalServices = ['google', 'facebook', 'netflix', 'stripe'];
        const hasNetworkOutage =
          Object.keys(data.error || {}).filter((k) =>
            externalServices.includes(k),
          ).length > 1;
        const hasMemoryRssError = !!data.error?.memory_rss;
        const hasStorageError = !!data.error?.storage;
        const hasOtherErrors =
          Object.keys(data.error || {}).filter(
            (k) => ![...externalServices, 'memory_rss', 'storage'].includes(k),
          ).length > 0;
        if (
          (!hasNetworkOutage || hasStorageError || hasMemoryRssError) &&
          !hasOtherErrors
        ) {
          code = 200;
          message = `Looks like you've found a healthy service.`;
          break;
        }
        code = 503;
        message = `We are sorry you've experienced some problems. Please try again later.`;
        break;
    }
    const response = {
      status: data.status,
      code,
      message,
      timestamp: new Date().toJSON(),
      path: req.url,
      info: data.info,
      error: data.error,
      details: data.details,
    };
    res.status(code).send(response);
    return response;
  }
}
