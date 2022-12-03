import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMDTrasactionFilterComponent } from './emdtrasaction-filter.component';

describe('EMDTrasactionFilterComponent', () => {
  let component: EMDTrasactionFilterComponent;
  let fixture: ComponentFixture<EMDTrasactionFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMDTrasactionFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMDTrasactionFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
