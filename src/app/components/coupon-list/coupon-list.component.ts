import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CouponService } from '../../services/coupon.service';

@Component({
  selector: 'app-coupon-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './coupon-list.component.html',
  styleUrls: ['./coupon-list.component.css'],
})
export class CouponListComponent implements OnInit {
  coupons: any[] = [];
  filteredCoupons: any[] = [];
  paginatedCoupons: any[] = [];
  searchQuery: string = '';
  sortOrder: string = 'newest';
  showFilters: boolean = false;

  categories: string[] = ['Tech', 'Fashion', 'Food', 'Health', 'Engineering'];
  discountRanges: string[] = [
    'Free',
    '0-10%',
    '10-25%',
    '35-50%',
    '50-65%',
    '65% & Above',
  ];
  locations: string[] = ['Lagos', 'Ogun', 'Oyo', 'Abuja', 'Port Harcourt'];

  selectedCategory: string | null = null;
  selectedDiscount: string | null = null;
  selectedLocation: string | null = null;

  minPrice: number = 1000;
  maxPrice: number = 500000;

  priceRange: { min: number; max: number } = { min: 1000, max: 500000 };

  currentPage: number = 1;
  pageSize: number = 16;
  totalPages: number = 1;

  constructor(private couponService: CouponService) {}

  ngOnInit(): void {
    this.couponService.getCoupons().subscribe({
      next: (data) => {
        // Add dynamic image property to each coupon
        this.coupons = data.map((coupon: any) => ({
          ...coupon,
          image: this.getImageForCategory(coupon.category?.category_name),
        }));
        this.filteredCoupons = [...this.coupons];
        this.updatePagination();
      },
      error: (err) => console.error('Error loading coupons:', err),
    });
  }

  // Function to return sample image URLs based on category
  getImageForCategory(category: string | undefined): string {
    const mapping: { [key: string]: string } = {
      Tech: 'https://source.unsplash.com/400x300/?tech,gadgets',
      Fashion: 'https://source.unsplash.com/400x300/?fashion,clothes',
      Food: 'https://source.unsplash.com/400x300/?food,restaurant',
      Health: 'https://source.unsplash.com/400x300/?health,fitness',
      Engineering: 'https://source.unsplash.com/400x300/?engineering,tools',
    };
    return mapping[category || ''] || 'https://source.unsplash.com/400x300/?shopping';
  }

  filterCoupons(): void {
    this.filteredCoupons = this.coupons.filter((coupon) =>
      coupon.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.applyFilters();
  }

  sortCoupons(): void {
    this.filteredCoupons.sort((a, b) => {
      return this.sortOrder === 'newest'
        ? new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        : new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
    });
    this.updatePagination();
  }

  filterByCategory(category: string): void {
    this.selectedCategory =
      this.selectedCategory === category ? null : category;
    this.applyFilters();
  }

  filterByDiscount(range: string): void {
    this.selectedDiscount = this.selectedDiscount === range ? null : range;
    this.applyFilters();
  }

  filterByLocation(location: string): void {
    this.selectedLocation =
      this.selectedLocation === location ? null : location;
    this.applyFilters();
  }

  updatePriceRange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCoupons = this.coupons.filter((coupon) => {
      const discount = coupon.coupon_discount;
      const categoryMatch =
        !this.selectedCategory ||
        coupon.category?.category_name === this.selectedCategory;
      const locationMatch =
        !this.selectedLocation ||
        coupon.company_location === this.selectedLocation;
      const priceMatch =
        parseFloat(coupon.amount) >= this.minPrice &&
        parseFloat(coupon.amount) <= this.maxPrice;

      let discountMatch = true;
      if (this.selectedDiscount) {
        if (this.selectedDiscount === 'Free') discountMatch = discount === 0;
        if (this.selectedDiscount === '0-10%')
          discountMatch = discount > 0 && discount <= 10;
        if (this.selectedDiscount === '10-25%')
          discountMatch = discount > 10 && discount <= 25;
        if (this.selectedDiscount === '35-50%')
          discountMatch = discount > 35 && discount <= 50;
        if (this.selectedDiscount === '50-65%')
          discountMatch = discount > 50 && discount <= 65;
        if (this.selectedDiscount === '65% & Above')
          discountMatch = discount > 65;
      }

      return categoryMatch && locationMatch && priceMatch && discountMatch;
    });

    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredCoupons.length / this.pageSize);
    this.paginatedCoupons = this.filteredCoupons.slice(
      (this.currentPage - 1) * this.pageSize,
      this.currentPage * this.pageSize
    );
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }
}
