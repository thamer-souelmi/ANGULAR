import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateQuoteComponent } from './update-quote.component';

describe('UpdateQuoteComponent', () => {
  let component: UpdateQuoteComponent;
  let fixture: ComponentFixture<UpdateQuoteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateQuoteComponent]
    });
    fixture = TestBed.createComponent(UpdateQuoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
