import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OBSExcelUploadComponent } from './obs-excel-upload.component';

describe('OBSExcelUploadComponent', () => {
  let component: OBSExcelUploadComponent;
  let fixture: ComponentFixture<OBSExcelUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OBSExcelUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OBSExcelUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
