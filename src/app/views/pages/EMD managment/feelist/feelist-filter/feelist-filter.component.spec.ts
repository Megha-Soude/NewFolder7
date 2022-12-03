import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelistFilterComponent } from './feelist-filter.component';

describe('FeelistFilterComponent', () => {
  let component: FeelistFilterComponent;
  let fixture: ComponentFixture<FeelistFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelistFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
