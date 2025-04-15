import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAdminComponent } from './productadmin.component';

describe('ProductadminComponent', () => {
  let component: ProductAdminComponent;
  let fixture: ComponentFixture<ProductAdminComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProductAdminComponent]
    });
    fixture = TestBed.createComponent(ProductAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
