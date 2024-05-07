import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreenshotDisplayComponent } from './screenshot-display.component';

describe('ScreenshotDisplayComponent', () => {
  let component: ScreenshotDisplayComponent;
  let fixture: ComponentFixture<ScreenshotDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScreenshotDisplayComponent]
    });
    fixture = TestBed.createComponent(ScreenshotDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
