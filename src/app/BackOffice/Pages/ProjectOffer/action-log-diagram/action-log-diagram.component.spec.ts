import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionLogDiagramComponent } from './action-log-diagram.component';

describe('ActionLogDiagramComponent', () => {
  let component: ActionLogDiagramComponent;
  let fixture: ComponentFixture<ActionLogDiagramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionLogDiagramComponent]
    });
    fixture = TestBed.createComponent(ActionLogDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
