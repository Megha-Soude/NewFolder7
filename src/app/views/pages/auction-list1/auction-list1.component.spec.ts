import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuctionList1Component } from './auction-list1.component';

describe('AuctionList1Component', () => {
  let component: AuctionList1Component;
  let fixture: ComponentFixture<AuctionList1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuctionList1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuctionList1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
