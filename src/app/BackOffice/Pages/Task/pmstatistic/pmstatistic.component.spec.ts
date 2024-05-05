import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PMstatisticComponent } from './pmstatistic.component';

describe('PMstatisticComponent', () => {
  let component: PMstatisticComponent;
  let fixture: ComponentFixture<PMstatisticComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PMstatisticComponent]
    });
    fixture = TestBed.createComponent(PMstatisticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
