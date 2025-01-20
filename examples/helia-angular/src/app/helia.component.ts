import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class HeliaComponent implements OnInit {
  title = 'helia-angular';
  helia: any | null = null;
  id: string | null = null;
  isOnline: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: any) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const { createHelia } = await import('helia');
        this.helia = await createHelia();
        console.log('Helia initialized:', this.helia);
  
        // Fetch the node's ID
        if (this.helia.libp2p) {
          const peerId = await this.helia.libp2p.peerId;
          this.id = peerId.toString();
        } else {
          console.error('libp2p is not initialized in Helia.');
        }
      } catch (error) {
        console.error('Error initializing Helia:', error);
      }
    }
  }
}
