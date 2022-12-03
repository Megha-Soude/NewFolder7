import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsFilterComponent } from './obs-filter.component';

describe('ObsFilterComponent', () => {
  let component: ObsFilterComponent;
  let fixture: ComponentFixture<ObsFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
