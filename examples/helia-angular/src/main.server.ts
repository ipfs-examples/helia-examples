import { bootstrapApplication } from '@angular/platform-browser';
import { HeliaComponent } from './app/helia.component';
import { config } from './app/app.config.server';

const bootstrap = () => bootstrapApplication(HeliaComponent, config);

export default bootstrap;
