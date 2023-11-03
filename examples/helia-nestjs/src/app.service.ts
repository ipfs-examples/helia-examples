import { Injectable } from '@nestjs/common';
import type { Helia } from '@helia/interface';

@Injectable()
export class AppService {
  private helia?: Helia;

  async getHelia(): Promise<Helia> {
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
