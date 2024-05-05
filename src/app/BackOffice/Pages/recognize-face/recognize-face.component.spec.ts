import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecognizeFaceComponent } from './recognize-face.component';

describe('RecognizeFaceComponent', () => {
  let component: RecognizeFaceComponent;
  let fixture: ComponentFixture<RecognizeFaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RecognizeFaceComponent]
    });
    fixture = TestBed.createComponent(RecognizeFaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
