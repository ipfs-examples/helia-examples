import { Component, OnInit } from '@angular/core';
import { createHelia } from 'helia';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title = 'helia-angular-example';
  helia: any | null = null;
  id: string | null = null;
  isOnline: boolean = false;

  async ngOnInit() {
    try {
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
