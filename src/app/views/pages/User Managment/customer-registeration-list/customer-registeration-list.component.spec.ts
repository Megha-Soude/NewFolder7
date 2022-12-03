import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerRegisterationListComponent } from './customer-registeration-list.component';

describe('CustomerRegisterationListComponent', () => {
  let component: CustomerRegisterationListComponent;
  let fixture: ComponentFixture<CustomerRegisterationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerRegisterationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerRegisterationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
