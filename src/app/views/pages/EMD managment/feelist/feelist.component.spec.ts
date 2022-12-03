import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeelistComponent } from './feelist.component';

describe('FeelistComponent', () => {
  let component: FeelistComponent;
  let fixture: ComponentFixture<FeelistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeelistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
