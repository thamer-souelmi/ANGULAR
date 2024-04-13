import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormsuggestComponent } from './formsuggest.component';

describe('FormsuggestComponent', () => {
  let component: FormsuggestComponent;
  let fixture: ComponentFixture<FormsuggestComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FormsuggestComponent]
    });
    fixture = TestBed.createComponent(FormsuggestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
