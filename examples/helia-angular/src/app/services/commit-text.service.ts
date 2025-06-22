import { isPlatformBrowser } from '@angular/common'
import { Injectable, PLATFORM_ID, Inject } from '@angular/core'
import { CID } from 'multiformats/cid'
import { HeliaService } from './helia.service'

@Injectable({
  providedIn: 'root'
})
export class CommitTextService {
  constructor (
    private readonly heliaService: HeliaService,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  async commitText (text: string): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null
    }

    try {
      const fs = await this.heliaService.getFs()
      const encoder = new TextEncoder()
      const bytes = encoder.encode(text)
      const cid = await fs.addBytes(bytes)
      return cid.toString()
    } catch (error) {
      console.error('Error committing text:', error)
      throw error // Re-throw to let component handle it
    }
  }

  async fetchCommittedText (cidString: string): Promise<string | null> {
    if (!isPlatformBrowser(this.platformId)) {
      return null
    }

    try {
      const fs = await this.heliaService.getFs()
      const decoder = new TextDecoder()
      const chunks: Uint8Array[] = []

      const cid = CID.parse(cidString)

      for await (const chunk of fs.cat(cid)) {
        chunks.push(chunk)
      }

      const allBytes = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        allBytes.set(chunk, offset)
        offset += chunk.length
      }

      return decoder.decode(allBytes)
    } catch (error) {
      console.error('Error fetching committed text:', error)
      throw error // Re-throw to let component handle it
    }
  }
}
