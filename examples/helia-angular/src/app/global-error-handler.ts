import { type ErrorHandler } from '@angular/core'

export class GlobalErrorHandler implements ErrorHandler {
  handleError (error: any): void {
    // eslint-disable-next-line no-console
    console.error('Global Error Handler:', error)
  }
}
