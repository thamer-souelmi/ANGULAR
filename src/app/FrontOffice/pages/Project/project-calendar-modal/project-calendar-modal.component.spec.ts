import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectCalendarModalComponent } from './project-calendar-modal.component';

describe('ProjectCalendarModalComponent', () => {
  let component: ProjectCalendarModalComponent;
  let fixture: ComponentFixture<ProjectCalendarModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectCalendarModalComponent]
    });
    fixture = TestBed.createComponent(ProjectCalendarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
