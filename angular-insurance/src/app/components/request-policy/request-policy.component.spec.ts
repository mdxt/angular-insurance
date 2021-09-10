import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestPolicyComponent } from './request-policy.component';

describe('RequestPolicyComponent', () => {
  let component: RequestPolicyComponent;
  let fixture: ComponentFixture<RequestPolicyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestPolicyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
