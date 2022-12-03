import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcrReportComponent } from './acr-report.component';

describe('AcrReportComponent', () => {
  let component: AcrReportComponent;
  let fixture: ComponentFixture<AcrReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcrReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcrReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
