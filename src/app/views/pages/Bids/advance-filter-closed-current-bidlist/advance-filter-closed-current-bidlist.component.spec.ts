import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceFilterClosedCurrentBidlistComponent } from './advance-filter-closed-current-bidlist.component';

describe('AdvanceFilterClosedCurrentBidlistComponent', () => {
  let component: AdvanceFilterClosedCurrentBidlistComponent;
  let fixture: ComponentFixture<AdvanceFilterClosedCurrentBidlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdvanceFilterClosedCurrentBidlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvanceFilterClosedCurrentBidlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
