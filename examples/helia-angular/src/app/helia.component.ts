import { ChangeDetectorRef, Component, Inject, type OnDestroy, type OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
// The HeliaService is injected, and eslint can't tell that it needs to be referenced as a Class.
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HeliaService } from './helia.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class HeliaComponent implements OnInit, OnDestroy {
  title = 'helia-angular'
  id: string | null = null
  isOnline: boolean = false
  private readonly subscriptions: Subscription = new Subscription()

  constructor (private readonly HeliaService: HeliaService, @Inject(ChangeDetectorRef) private readonly cdr: ChangeDetectorRef) {}

  ngOnInit (): void {
    this.subscriptions.add(
      this.HeliaService.getId()?.subscribe((newId) => {
        if (this.id !== newId) {
          this.id = newId
          this.cdr.detectChanges()
        }
      })
    )

    this.subscriptions.add(
      this.HeliaService.isOnline().subscribe(newIsOnline => {
        if (this.isOnline !== newIsOnline) {
          this.isOnline = newIsOnline
          this.cdr.detectChanges()
        }
      })
    )
  }

  ngOnDestroy (): void {
    this.subscriptions.unsubscribe()
  }
}
