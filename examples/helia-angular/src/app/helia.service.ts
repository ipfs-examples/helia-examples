// services/globalsetting.service.ts
import { Injectable, NgZone } from '@angular/core'
import { createHelia, type HeliaLibp2p } from 'helia'
import { BehaviorSubject, type Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class HeliaService extends NgZone {
  private readonly idSubject = new BehaviorSubject<string | null>(null)
  private readonly isOnlineSubject = new BehaviorSubject<boolean>(false)

  title = 'helia-angular'
  helia: HeliaLibp2p | null = null

  constructor () {
    super({ enableLongStackTrace: true })

    this.runOutsideAngular(async () => {
      await this.initializeHelia()
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Error initializing Helia:', err)
    })
  }

  async initializeHelia (): Promise<void> {
    if (this.helia != null) return

    try {
      this.helia = await createHelia()
      this.idSubject.next(this.helia?.libp2p.peerId.toString() ?? null)
      this.isOnlineSubject.next(this.helia?.libp2p.status === 'started')
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error initializing Helia:', err)
    }
  }

  getId (): Observable<string | null> {
    return this.idSubject.asObservable()
  }

  isOnline (): Observable<boolean> {
    return this.isOnlineSubject.asObservable()
  }
}
