import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { CouponListComponent } from './components/coupon-list/coupon-list.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, CouponListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'coupon-app';
}
