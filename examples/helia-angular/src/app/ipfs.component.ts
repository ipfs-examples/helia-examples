import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { createHelia } from 'helia';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class IPFSComponent implements OnInit {
  title = 'helia-angular';
  id: string | null = null;
  isOnline = false;
  helia: any = null;

  async ngOnInit() {
    if (this.helia) return;

    try {
      const heliaNode = await createHelia();
      const nodeId = heliaNode.libp2p.peerId.toString();
      const nodeIsOnline = heliaNode.libp2p.status === 'started';

      this.helia = heliaNode;
      this.id = nodeId;
      this.isOnline = nodeIsOnline;
    } catch (error) {
      console.error('Error initializing Helia:', error);
    }
  }
}
