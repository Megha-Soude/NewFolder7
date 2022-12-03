import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClosedBidListComponent } from './closed-bid-list.component';

describe('ClosedBidListComponent', () => {
  let component: ClosedBidListComponent;
  let fixture: ComponentFixture<ClosedBidListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClosedBidListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClosedBidListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
