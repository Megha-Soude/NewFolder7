import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerRegistrationListComponent } from './buyer-registration-list.component';

describe('BuyerRegistrationListComponent', () => {
  let component: BuyerRegistrationListComponent;
  let fixture: ComponentFixture<BuyerRegistrationListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyerRegistrationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
