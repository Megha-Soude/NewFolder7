import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidWinnersComponent } from './bid-winners.component';

describe('BidWinnersComponent', () => {
  let component: BidWinnersComponent;
  let fixture: ComponentFixture<BidWinnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidWinnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidWinnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
