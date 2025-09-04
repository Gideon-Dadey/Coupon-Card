import { TestBed } from '@angular/core/testing';
import { CouponService } from './coupon.service';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { of } from 'rxjs';

describe('CouponService', () => {
  let service: CouponService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CouponService, provideHttpClient(withInterceptorsFromDi())],
    });

    service = TestBed.inject(CouponService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch coupons from the API', () => {
    const mockCoupons = [
      { id: 1, title: 'Amazon Deal', discount: 20 },
      { id: 2, title: 'Jumia Discount', discount: 15 },
    ];

    spyOn(service, 'getCoupons').and.returnValue(of(mockCoupons));

    service.getCoupons().subscribe((coupons) => {
      expect(coupons.length).toBe(2);
      expect(coupons).toEqual(mockCoupons);
    });
  });
});
