import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailprojectbackComponent } from './detailprojectback.component';

describe('DetailprojectbackComponent', () => {
  let component: DetailprojectbackComponent;
  let fixture: ComponentFixture<DetailprojectbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetailprojectbackComponent]
    });
    fixture = TestBed.createComponent(DetailprojectbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
