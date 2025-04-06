import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BabySittingComponent } from './baby-sitting.component';

describe('BabySittingComponent', () => {
  let component: BabySittingComponent;
  let fixture: ComponentFixture<BabySittingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BabySittingComponent]
    });
    fixture = TestBed.createComponent(BabySittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
