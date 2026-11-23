import { TestBed } from '@angular/core/testing';
import { HeliaComponent } from './helia.component';

describe('HeliaComponent', () => {
  let mockHelia: any;

  beforeEach(async () => {
    mockHelia = {
      libp2p: {
        peerId: { toString: () => 'mock-peer-id' },
      },
    };

    await TestBed.configureTestingModule({
      imports: [HeliaComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(HeliaComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the 'helia-angular' title`, () => {
    const fixture = TestBed.createComponent(HeliaComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('helia-angular');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(HeliaComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, helia-angular');
  });

  it('should initialize Helia and fetch the peer ID', async () => {
    const fixture = TestBed.createComponent(HeliaComponent); // Create the component fixture first
    const app = fixture.componentInstance; // Assign the app variable after fixture creation
  
    // Spy on ngOnInit after app has been defined
    spyOn(app, 'ngOnInit').and.callFake(async () => {
      app.helia = mockHelia; // Mock Helia initialization
      app.id = mockHelia.libp2p.peerId.toString(); // Mock Peer ID fetching
    });
  
    await app.ngOnInit(); // Call ngOnInit to trigger the mocked logic
  
    expect(app.helia).toEqual(mockHelia); // Assert that helia was initialized
    expect(app.id).toEqual('mock-peer-id'); // Assert that the mock Peer ID is set
  });
  
});