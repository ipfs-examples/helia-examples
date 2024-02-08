import { Injectable } from '@nestjs/common';
import type { HeliaLibp2p } from 'helia';

@Injectable()
export class AppService {
  private helia?: HeliaLibp2p;

  async getHelia(): Promise<HeliaLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await import('helia');
      this.helia = await createHelia();
    }

    return this.helia;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop();
    }
  }
}
