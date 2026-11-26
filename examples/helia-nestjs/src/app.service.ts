import { Injectable } from '@nestjs/common'
import type { HeliaWithLibp2p } from '@helia/libp2p'

@Injectable()
export class AppService {
  private helia?: HeliaWithLibp2p

  async getHelia (): Promise<HeliaWithLibp2p> {
    if (this.helia == null) {
      const { createHelia } = await import('helia')
      this.helia = await createHelia().start()
    }

    return this.helia
  }

  async onApplicationShutdown (): Promise<void> {
    if (this.helia != null) {
      await this.helia.stop()
    }
  }
}
