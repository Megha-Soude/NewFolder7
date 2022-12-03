import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCustomerUserComponent } from './update-customer-user.component';

describe('UpdateCustomerUserComponent', () => {
  let component: UpdateCustomerUserComponent;
  let fixture: ComponentFixture<UpdateCustomerUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateCustomerUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCustomerUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
