import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataFlowLineageComponent } from './data-flow-lineage.component';

describe('DataFlowLineageComponent', () => {
  let component: DataFlowLineageComponent;
  let fixture: ComponentFixture<DataFlowLineageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DataFlowLineageComponent]
    });
    fixture = TestBed.createComponent(DataFlowLineageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
