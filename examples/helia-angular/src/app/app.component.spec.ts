import { TestBed } from '@angular/core/testing'
import { HeliaComponent } from './helia.component'

describe('HeliaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeliaComponent]
    }).compileComponents()
  })

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HeliaComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

  it('should have the \'helia-angular\' title', () => {
    const fixture = TestBed.createComponent(HeliaComponent)
    const app = fixture.componentInstance
    expect(app.title).toEqual('helia-angular')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(HeliaComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement as HTMLElement
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, helia-angular')
  })
})
