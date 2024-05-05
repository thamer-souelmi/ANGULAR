import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsbackComponent } from './projectsback.component';

describe('ProjectsbackComponent', () => {
  let component: ProjectsbackComponent;
  let fixture: ComponentFixture<ProjectsbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProjectsbackComponent]
    });
    fixture = TestBed.createComponent(ProjectsbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
