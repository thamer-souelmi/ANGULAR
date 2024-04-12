import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventBComponent } from './event-b.component';

describe('EventBComponent', () => {
  let component: EventBComponent;
  let fixture: ComponentFixture<EventBComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventBComponent]
    });
    fixture = TestBed.createComponent(EventBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
