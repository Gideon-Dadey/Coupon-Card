import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CouponService {
  private jsonUrl = 'couponDataTest.json';

  constructor(private http: HttpClient) {}

  getCoupons(): Observable<any[]> {
    return this.http
      .get<any>(this.jsonUrl)
      .pipe(map((response) => response.data || []));
  }
}
