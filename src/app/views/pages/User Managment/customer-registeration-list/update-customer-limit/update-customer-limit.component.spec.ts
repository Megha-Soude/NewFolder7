import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerLimitComponent } from './update-customer-limit.component';

describe('UpdateCustomerLimitComponent', () => {
  let component: UpdateCustomerLimitComponent;
  let fixture: ComponentFixture<UpdateCustomerLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCustomerLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
