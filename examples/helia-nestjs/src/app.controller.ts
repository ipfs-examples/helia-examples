import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHeliaVersion(): Promise<string> {
    const helia = await this.appService.getHelia();
    return 'Helia is running, PeerId ' + helia.libp2p.peerId.toString();
  }

  async onApplicationShutdown(): Promise<void> {
    await this.appService.onApplicationShutdown();
  }
}
