import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { isPlatformBrowser, CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
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
        const peerId = await this.helia.libp2p.peerId;
        this.id = peerId.toString();
      } catch (error) {
        console.error('Error initializing Helia:', error);
      }
    }
  }
}
