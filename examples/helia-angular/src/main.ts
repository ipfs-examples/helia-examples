import { enableProdMode } from '@angular/core'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { AppModule } from './app/app.module'

if (process.env['NODE_ENV'] === 'production') {
  enableProdMode()
}

localStorage.setItem('debug', '*,*:trace')
platformBrowserDynamic().bootstrapModule(AppModule)
  // eslint-disable-next-line no-console
  .catch((err: any) => { console.log(err) })

// bootstrapApplication(IPFSComponent, appConfig)
//   // eslint-disable-next-line no-console
//   .catch((err) => { console.error(err) })
