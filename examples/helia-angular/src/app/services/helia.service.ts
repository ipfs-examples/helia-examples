import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
import type { Helia } from '@helia/interface';
import type { UnixFS } from '@helia/unixfs';
import { webSockets } from '@libp2p/websockets';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';
import { createLibp2p } from 'libp2p';

export interface HeliaStatus {
  initialized: boolean;
  error?: Error;
  peerId?: string;
}

@Injectable({
  providedIn: 'root',
})
export class HeliaService {
  private helia: Helia | null = null;
  private fs: UnixFS | null = null;
  private statusSubject = new BehaviorSubject<HeliaStatus>({ initialized: false });
  private initPromise: Promise<void> | null = null;

  // IPFS bootstrap nodes
  private bootstrapNodes = [
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
    '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb'
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      this.initPromise = this.initHelia();
    }
  }

  get status$(): Observable<HeliaStatus> {
    return this.statusSubject.asObservable();
  }

  private async initHelia(): Promise<void> {
    if (this.helia) return;
    
    try {
      const libp2p = await createLibp2p({
          // addresses: {
          //   listen: ['/ip4/127.0.0.1/tcp/0/ws']

          // },
          transports: [webSockets()],
          connectionEncrypters: [(noise() as any)],
          streamMuxers: [(_: any) => yamux()() as any],

          peerDiscovery: [
            bootstrap({
              list: this.bootstrapNodes
            }) as any
          ],
      });
      
      this.helia = await createHelia({ libp2p });
      this.fs = unixfs(this.helia);
      
      this.statusSubject.next({
        initialized: true,
        peerId: (this.helia as any).libp2p.peerId.toString()
      });
    } catch (error) {
      console.error('Helia initialization error:', error);
      this.statusSubject.next({
        initialized: false,
        error: error instanceof Error ? error : new Error('Unknown error')
      });
      throw error;
    }
  }

  private async waitForInitialization(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Helia is only available in browser environment');
    }

    if (this.statusSubject.value.initialized) {
      return;
    }

    await firstValueFrom(
      this.status$.pipe(
        filter(status => status.initialized || !!status.error)
      )
    );

    if (this.statusSubject.value.error) {
      throw this.statusSubject.value.error;
    }
  }

  async getHelia(): Promise<Helia> {
    await this.waitForInitialization();
    
    if (!this.helia) {
      throw new Error('Helia failed to initialize');
    }
    
    return this.helia;
  }

  async getFs(): Promise<UnixFS> {
    await this.waitForInitialization();
    
    if (!this.fs) {
      throw new Error('UnixFS failed to initialize');
    }
    
    return this.fs;
  }
}