import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObsApprovalComponent } from './obs-approval.component';

describe('ObsApprovalComponent', () => {
  let component: ObsApprovalComponent;
  let fixture: ComponentFixture<ObsApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObsApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObsApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
