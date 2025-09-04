import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CouponListComponent } from './coupon-list.component';
import { CouponService } from '../../services/coupon.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { of } from 'rxjs';

describe('CouponListComponent', () => {
  let component: CouponListComponent;
  let fixture: ComponentFixture<CouponListComponent>;
  let couponService: CouponService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        CouponListComponent,
        CouponService,
        provideHttpClient(withInterceptorsFromDi()),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CouponListComponent);
    component = fixture.componentInstance;
    couponService = TestBed.inject(CouponService);

    // Mock API response
    spyOn(couponService, 'getCoupons').and.returnValue(
      of([
        { title: 'Amazon Deal', discount: 20, date: '2024-02-12' },
        { title: 'Jumia Discount', discount: 15, date: '2024-02-10' },
      ])
    );

    fixture.detectChanges();
  });

  it('should create the CouponListComponent', () => {
    expect(component).toBeTruthy();
  });

  it('should filter coupons by title', () => {
    component.searchQuery = 'Amazon';
    component.filterCoupons();
    expect(component.filteredCoupons.length).toBe(1);
    expect(component.filteredCoupons[0].title).toBe('Amazon Deal');
  });

  it('should sort coupons from newest to oldest', () => {
    component.sortOrder = 'newest';
    component.sortCoupons();
    expect(component.filteredCoupons[0].title).toBe('Amazon Deal');
  });

  it('should navigate to the next page', () => {
    component.totalPages = 2;
    component.currentPage = 1;
    component.nextPage();
    expect(component.currentPage).toBe(2);
  });

  it('should navigate to the previous page', () => {
    component.currentPage = 2;
    component.prevPage();
    expect(component.currentPage).toBe(1);
  });

  it('should filter coupons by discount range', () => {
    component.filterByDiscount('10-25%');
    expect(component.filteredCoupons.length).toBe(2);
  });

  it('should filter coupons by category', () => {
    component.selectedCategory = 'Amazon';
    component.filterByCategory('Amazon');
    expect(component.filteredCoupons.length).toBe(1);
    expect(component.filteredCoupons[0].title).toBe('Amazon Deal');
  });
});
