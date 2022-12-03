import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatyMasterComponent } from './paty-master.component';

describe('PatyMasterComponent', () => {
  let component: PatyMasterComponent;
  let fixture: ComponentFixture<PatyMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatyMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatyMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
