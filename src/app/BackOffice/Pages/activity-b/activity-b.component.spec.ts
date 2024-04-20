import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityBComponent } from './activity-b.component';

describe('ActivityBComponent', () => {
  let component: ActivityBComponent;
  let fixture: ComponentFixture<ActivityBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityBComponent]
    });
    fixture = TestBed.createComponent(ActivityBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
