import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { IPFSComponent } from './app/ipfs.component';

bootstrapApplication(IPFSComponent, appConfig)
  .catch((err) => console.error(err));
