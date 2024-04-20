import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksByprojectComponent } from './tasks-byproject.component';

describe('TasksByprojectComponent', () => {
  let component: TasksByprojectComponent;
  let fixture: ComponentFixture<TasksByprojectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TasksByprojectComponent]
    });
    fixture = TestBed.createComponent(TasksByprojectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
