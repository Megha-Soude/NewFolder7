import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EMDListComponent } from './emdlist.component';

describe('EMDListComponent', () => {
  let component: EMDListComponent;
  let fixture: ComponentFixture<EMDListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EMDListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EMDListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
