import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrReportFilterComponent } from './acr-report-filter.component';

describe('AcrReportFilterComponent', () => {
  let component: AcrReportFilterComponent;
  let fixture: ComponentFixture<AcrReportFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcrReportFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrReportFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
