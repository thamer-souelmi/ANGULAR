import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersuggestinfoComponent } from './usersuggestinfo.component';

describe('UsersuggestinfoComponent', () => {
  let component: UsersuggestinfoComponent;
  let fixture: ComponentFixture<UsersuggestinfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersuggestinfoComponent]
    });
    fixture = TestBed.createComponent(UsersuggestinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
