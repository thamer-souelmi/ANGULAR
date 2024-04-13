import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAllProjectsComponent } from './find-all-projects.component';

describe('FindAllProjectsComponent', () => {
  let component: FindAllProjectsComponent;
  let fixture: ComponentFixture<FindAllProjectsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FindAllProjectsComponent]
    });
    fixture = TestBed.createComponent(FindAllProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
