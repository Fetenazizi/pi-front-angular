import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PregnancyTrackingComponent } from './pregnancy-tracking.component';

describe('PregnancyTrackingComponent', () => {
  let component: PregnancyTrackingComponent;
  let fixture: ComponentFixture<PregnancyTrackingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PregnancyTrackingComponent]
    });
    fixture = TestBed.createComponent(PregnancyTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
