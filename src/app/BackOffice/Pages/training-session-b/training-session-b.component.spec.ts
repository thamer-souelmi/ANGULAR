import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingSessionBComponent } from './training-session-b.component';

describe('TrainingSessionBComponent', () => {
  let component: TrainingSessionBComponent;
  let fixture: ComponentFixture<TrainingSessionBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainingSessionBComponent]
    });
    fixture = TestBed.createComponent(TrainingSessionBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
