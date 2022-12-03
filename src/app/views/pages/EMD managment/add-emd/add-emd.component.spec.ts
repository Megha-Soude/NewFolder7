import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEMDComponent } from './add-emd.component';

describe('AddEMDComponent', () => {
  let component: AddEMDComponent;
  let fixture: ComponentFixture<AddEMDComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEMDComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEMDComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
