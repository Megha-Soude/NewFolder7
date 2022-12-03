import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolePageMappingComponent } from './role-page-mapping.component';

describe('RolePageMappingComponent', () => {
  let component: RolePageMappingComponent;
  let fixture: ComponentFixture<RolePageMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolePageMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolePageMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
