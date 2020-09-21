import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeActionComponent } from './product-type-action.component';

describe('ProductTypeActionComponent', () => {
  let component: ProductTypeActionComponent;
  let fixture: ComponentFixture<ProductTypeActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductTypeActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
