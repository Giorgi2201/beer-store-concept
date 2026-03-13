import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { Beer, ApiService } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CartService, CartItem } from '../services/cart.service';

interface FilterOptions {
  styles: string[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export interface InitialFilters {
  styles?: string[];
  brands?: string[];
  searchTerm?: string;
  categoryName?: string;
}

@Component({
  selector: 'app-category-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.css'
})
export class CategoryViewComponent implements OnInit, OnDestroy {
  @Input() categoryName: string = '';
  @Input() beers: Beer[] = [];
  @Input() initialFilters: InitialFilters = {};
  @Output() openLogin = new EventEmitter<void>();

  filteredBeers: Beer[] = [];
  private allBeers: Beer[] = [];
  filterOptions: FilterOptions = {
    styles: [],
    brands: [],
    priceRange: { min: 0, max: 100 }
  };

  selectedStyles: string[] = [];
  selectedBrands: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 100;
  sortBy: string = 'name';
  searchTerm = '';

  isLoggedIn = false;
  isLoading = false;
  addingToCart: { [beerId: number]: boolean } = {};
  addedToCart:  { [beerId: number]: boolean } = {};
  cartItemMap:  { [beerId: number]: CartItem } = {};
  updatingQty:  { [beerId: number]: boolean } = {};

  private searchSubject$ = new Subject<string>();
  private authSub?: Subscription;
  private cartSub?: Subscription;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.authSub = this.authService.isAuthenticated$.subscribe(auth => {
      this.isLoggedIn = auth;
      if (auth) {
        // Ensure cart data is loaded so quantity controls show immediately
        this.cartService.getCart().subscribe();
      }
    });

    // Keep cartItemMap in sync with the shared cart BehaviorSubject
    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cartItemMap = {};
      if (cart?.items) {
        cart.items.forEach(item => { this.cartItemMap[item.beerId] = item; });
      }
    });

    // Apply initial filter selections before loading data
    this.applyInitialFilters();

    if (this.beers.length > 0) {
      // Beers were pre-loaded (legacy path)
      this.allBeers = [...this.beers];
      this.initializeFilters();
      this.applyFilters();
    } else {
      // Fetch from API using categoryName, searchTerm, or just load all
      this.loadFromApi(this.initialFilters.searchTerm || '');
    }

    this.searchSubject$.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(term => {
      this.loadFromApi(term);
    });
  }

  ngOnDestroy() {
    this.searchSubject$.complete();
    this.authSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  private loadFromApi(searchTerm: string) {
    this.isLoading = true;
    this.apiService.getBeers({
      searchTerm: searchTerm || undefined,
      categoryName: this.initialFilters.categoryName || undefined,
      pageSize: 200
    }).subscribe({
      next: (result) => {
        this.allBeers = result.data;
        this.beers = result.data;
        this.initializeFilters();
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSearchTermChange() {
    this.applyFilters();
    this.searchSubject$.next(this.searchTerm);
  }

  initializeFilters() {
    const source = this.allBeers.length ? this.allBeers : this.beers;

    this.filterOptions.styles = [...new Set(source.map(b => b.style))].filter(Boolean).sort();
    this.filterOptions.brands = [...new Set(source.map(b => b.brand))].filter(Boolean).sort();

    if (source.length) {
      const prices = source.map(b => b.price);
      this.filterOptions.priceRange.min = Math.floor(Math.min(...prices));
      this.filterOptions.priceRange.max = Math.ceil(Math.max(...prices));

      // Only reset price range if not already set by the user
      if (this.minPrice === 0 && this.maxPrice === 100) {
        this.minPrice = this.filterOptions.priceRange.min;
        this.maxPrice = this.filterOptions.priceRange.max;
      }
    }
  }

  applyInitialFilters() {
    if (this.initialFilters.styles?.length) {
      this.selectedStyles = [...this.initialFilters.styles];
    }
    if (this.initialFilters.brands?.length) {
      this.selectedBrands = [...this.initialFilters.brands];
    }
  }

  toggleStyleFilter(style: string) {
    const index = this.selectedStyles.indexOf(style);
    if (index > -1) {
      this.selectedStyles.splice(index, 1);
    } else {
      this.selectedStyles.push(style);
    }
    this.applyFilters();
  }

  toggleBrandFilter(brand: string) {
    const index = this.selectedBrands.indexOf(brand);
    if (index > -1) {
      this.selectedBrands.splice(index, 1);
    } else {
      this.selectedBrands.push(brand);
    }
    this.applyFilters();
  }

  onPriceChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.selectedStyles = [];
    this.selectedBrands = [];
    this.searchTerm = '';
    this.minPrice = this.filterOptions.priceRange.min;
    this.maxPrice = this.filterOptions.priceRange.max;
    this.applyFilters();
  }

  applyFilters() {
    const term = this.searchTerm.trim().toLowerCase();

    this.filteredBeers = this.allBeers.filter(beer => {
      if (term && !beer.name.toLowerCase().includes(term)
               && !beer.brand.toLowerCase().includes(term)
               && !beer.style.toLowerCase().includes(term)) {
        return false;
      }
      if (this.selectedStyles.length > 0 && !this.selectedStyles.includes(beer.style)) {
        return false;
      }
      if (this.selectedBrands.length > 0 && !this.selectedBrands.includes(beer.brand)) {
        return false;
      }
      if (beer.price < this.minPrice || beer.price > this.maxPrice) {
        return false;
      }
      return true;
    });

    this.sortBeers();
  }

  sortBeers() {
    switch (this.sortBy) {
      case 'name':
        this.filteredBeers.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-asc':
        this.filteredBeers.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredBeers.sort((a, b) => b.price - a.price);
        break;
      case 'brand':
        this.filteredBeers.sort((a, b) => a.brand.localeCompare(b.brand));
        break;
    }
  }

  onSortChange() {
    this.sortBeers();
  }

  addToCart(beer: Beer) {
    if (!this.isLoggedIn) {
      this.openLogin.emit();
      return;
    }
    this.addingToCart[beer.id] = true;
    this.cartService.addToCart(beer.id, 1).subscribe({
      next: () => {
        this.addingToCart[beer.id] = false;
        this.addedToCart[beer.id]  = true;
        setTimeout(() => { this.addedToCart[beer.id] = false; }, 1600);
      },
      error: (err) => {
        this.addingToCart[beer.id] = false;
        if (err.status === 401) {
          this.openLogin.emit();
        }
      }
    });
  }

  increaseQty(beerId: number) {
    const item = this.cartItemMap[beerId];
    if (!item || this.updatingQty[beerId]) return;
    this.updatingQty[beerId] = true;
    this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe({
      next: () => { this.updatingQty[beerId] = false; },
      error: () => { this.updatingQty[beerId] = false; }
    });
  }

  decreaseQty(beerId: number) {
    const item = this.cartItemMap[beerId];
    if (!item || this.updatingQty[beerId]) return;
    this.updatingQty[beerId] = true;
    const action = item.quantity <= 1
      ? this.cartService.removeFromCart(item.id)
      : this.cartService.updateCartItem(item.id, item.quantity - 1);
    action.subscribe({
      next: () => { this.updatingQty[beerId] = false; },
      error: () => { this.updatingQty[beerId] = false; }
    });
  }
}
