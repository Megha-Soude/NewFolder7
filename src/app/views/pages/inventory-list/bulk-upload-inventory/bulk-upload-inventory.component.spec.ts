import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkUploadInventoryComponent } from './bulk-upload-inventory.component';

describe('BulkUploadInventoryComponent', () => {
  let component: BulkUploadInventoryComponent;
  let fixture: ComponentFixture<BulkUploadInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BulkUploadInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkUploadInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
