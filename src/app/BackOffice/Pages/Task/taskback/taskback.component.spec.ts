import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskbackComponent } from './taskback.component';

describe('TaskbackComponent', () => {
  let component: TaskbackComponent;
  let fixture: ComponentFixture<TaskbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TaskbackComponent]
    });
    fixture = TestBed.createComponent(TaskbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
