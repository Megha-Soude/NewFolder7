import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BidLogsComponent } from './bid-logs.component';

describe('BidLogsComponent', () => {
  let component: BidLogsComponent;
  let fixture: ComponentFixture<BidLogsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BidLogsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BidLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
