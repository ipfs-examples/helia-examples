import { NgModule, ErrorHandler } from '@angular/core'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { provideRouter, RouterOutlet } from '@angular/router'
import { routes } from './app.routes'
import { GlobalErrorHandler } from './global-error-handler'
import { HeliaComponent } from './helia.component'
import { HeliaService } from './helia.service'

@NgModule({
  declarations: [
    HeliaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterOutlet
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    HeliaService,
    provideRouter(routes)
  ],
  bootstrap: [HeliaComponent]
  // bootstrap: []
})
export class AppModule { }
