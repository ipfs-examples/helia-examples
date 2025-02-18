import { Component, PLATFORM_ID, Inject, OnInit, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommitTextService } from './services/commit-text.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HeliaService } from './services/helia.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Helia-Angular';
  text: string = '';
  cidString: string = '';
  committedText: string = '';
  isBrowser: boolean;
  private statusSubscription?: Subscription;
  heliaStatus = '';
  error: string = '';

  constructor(
    private commitTextService: CommitTextService,
    @Inject(PLATFORM_ID) platformId: Object,
    private heliaService: HeliaService
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    this.statusSubscription = this.heliaService.status$.subscribe(status => {
      this.heliaStatus = status.initialized ? 
        `Connected (${status.peerId})` : 
        status.error ? 'Error: ' + status.error.message : 'Initializing...';
    });
  }

  ngOnDestroy() {
    this.statusSubscription?.unsubscribe();
  }

  async addTextToNode() {
    if (!this.isBrowser) return;
    try {
      this.error = '';
      this.cidString = (await this.commitTextService.commitText(this.text)) || '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error occurred';
    }
  }

  async fetchCommittedText() {
    if (!this.isBrowser) return;
    try {
      this.error = '';
      this.committedText = (await this.commitTextService.fetchCommittedText(this.cidString)) || '';
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Unknown error occurred';
    }
  }
}