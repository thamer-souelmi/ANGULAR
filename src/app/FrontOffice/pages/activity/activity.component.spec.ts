import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityComponentF } from './activity.component';

describe('ActivityComponent', () => {
  let component: ActivityComponentF;
  let fixture: ComponentFixture<ActivityComponentF>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityComponentF]
    });
    fixture = TestBed.createComponent(ActivityComponentF);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
