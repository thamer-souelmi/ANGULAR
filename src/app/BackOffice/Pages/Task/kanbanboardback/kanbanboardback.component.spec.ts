import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KanbanboardbackComponent } from './kanbanboardback.component';

describe('KanbanboardbackComponent', () => {
  let component: KanbanboardbackComponent;
  let fixture: ComponentFixture<KanbanboardbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KanbanboardbackComponent]
    });
    fixture = TestBed.createComponent(KanbanboardbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
