import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HeliaComponent } from './app/helia.component';

bootstrapApplication(HeliaComponent, appConfig)
  .catch((err) => console.error(err));
