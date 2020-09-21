import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskTypeActionComponent } from './risk-type-action.component';

describe('RiskTypeActionComponent', () => {
  let component: RiskTypeActionComponent;
  let fixture: ComponentFixture<RiskTypeActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RiskTypeActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskTypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
