import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentBidlistComponent } from './current-bidlist.component';

describe('CurrentBidlistComponent', () => {
  let component: CurrentBidlistComponent;
  let fixture: ComponentFixture<CurrentBidlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrentBidlistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrentBidlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
