import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InspectionStatusComponent } from './inspection-status.component';

describe('InspectionStatusComponent', () => {
  let component: InspectionStatusComponent;
  let fixture: ComponentFixture<InspectionStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InspectionStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InspectionStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
