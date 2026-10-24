import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('creates the shell', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('shows DevMarket brand', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const brand = fixture.nativeElement.querySelector('.brand') as HTMLElement;
    expect(brand?.textContent).toContain('DevMarket');
  });
});
