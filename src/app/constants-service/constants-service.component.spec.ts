import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConstantsServiceComponent } from './constants-service.component';

describe('ConstantsServiceComponent', () => {
  let component: ConstantsServiceComponent;
  let fixture: ComponentFixture<ConstantsServiceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConstantsServiceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConstantsServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
