import { Component, EventEmitter, Output, OnInit, OnDestroy, AfterViewInit, HostListener, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, switchMap, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { CartService, CartItem } from '../services/cart.service';
import { AddressService } from '../services/address.service';
import { ApiService, Beer } from '../services/api.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() openLogin = new EventEmitter<void>();
  @Output() openCategories = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
  @Output() openProfile = new EventEmitter<void>();
  @Output() searchAll = new EventEmitter<string>();
  
  isScrolled = false;
  isLoggedIn = false;
  cartItemCount = 0;
  currentUserName = '';
  showUserDropdown = false;
  showCart = false;
  profilePicture: string | null = null;
  cartItems: CartItem[] = [];
  cartTotal = 0;
  deliveryCost: number | null = null;
  deliveryDistanceKm: number | null = null;
  nearestStoreName: string | null = null;

  // Search
  searchQuery = '';
  searchResults: Beer[] = [];
  showSearchDropdown = false;
  isSearching = false;
  private searchInput$ = new Subject<string>();

  get grandTotal(): number {
    return this.cartTotal + (this.deliveryCost ?? 0);
  }

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private addressService: AddressService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      if (isAuth) {
        this.loadCart();
        this.loadProfilePicture();
      } else {
        this.cartItemCount = 0;
        this.profilePicture = null;
      }
    });

    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserName = user.firstName;
        this.loadProfilePicture();
      } else {
        this.currentUserName = '';
      }
    });

    // Subscribe to cart updates
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.totalItems || 0;
      this.cartItems = cart?.items || [];
      this.cartTotal = cart?.totalAmount || 0;
    });

    // Listen for profile picture updates from localStorage
    window.addEventListener('storage', (e) => {
      if (e.key === 'profilePicture') {
        this.loadProfilePicture();
      }
    });

    // Debounced search — fires 300ms after user stops typing
    this.searchInput$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => {
        if (!query?.trim()) {
          this.searchResults = [];
          this.showSearchDropdown = false;
          this.isSearching = false;
          return of(null);
        }
        this.isSearching = true;
        this.showSearchDropdown = false;
        return this.apiService.getBeers({ searchTerm: query.trim(), pageSize: 3 });
      })
    ).subscribe({
      next: (result) => {
        this.isSearching = false;
        if (result) {
          this.searchResults = result.data;
          this.showSearchDropdown = true;
        }
      },
      error: (err) => {
        console.error('Search error:', err);
        this.isSearching = false;
      }
    });
  }

  ngOnDestroy() {
    this.searchInput$.complete();
  }

  ngAfterViewInit() {
    // Chrome may inject autofill values a few hundred ms after render.
    // Clear the search field after a short delay to remove any injected credentials.
    setTimeout(() => {
      const el = document.getElementById('beer-search-x') as HTMLInputElement | null;
      if (el && el.value && !this.searchQuery) {
        el.value = '';
      }
    }, 300);
  }

  loadProfilePicture() {
    const saved = localStorage.getItem('profilePicture');
    this.profilePicture = saved || null;
  }

  loadCart() {
    if (this.isLoggedIn) {
      this.cartService.getCart().subscribe({
        error: (err) => console.error('Error loading cart:', err)
      });
      this.loadDeliveryCost();
    }
  }

  loadDeliveryCost() {
    const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!raw) return;
    try {
      const user = JSON.parse(raw);
      if (user.latitude && user.longitude) {
        this.addressService.getDeliveryQuote(user.latitude, user.longitude).subscribe({
          next: (result) => {
            if (result.inZone) {
              this.deliveryCost        = result.cost;
              this.deliveryDistanceKm  = result.distanceKm;
              this.nearestStoreName    = result.nearestStoreName;
            } else {
              this.deliveryCost       = null;
              this.deliveryDistanceKm = null;
              this.nearestStoreName   = null;
            }
          }
        });
      }
    } catch { /* ignore */ }
  }

  onLoginClick() {
    if (this.isLoggedIn) {
      this.toggleUserDropdown();
    } else {
      this.openLogin.emit();
    }
  }

  toggleUserDropdown() {
    this.showUserDropdown = !this.showUserDropdown;
  }

  onLogout() {
    this.authService.logout();
    this.showUserDropdown = false;
  }

  onProfileClick() {
    this.showUserDropdown = false;
    this.openProfile.emit();
  }

  closeDropdown() {
    this.showUserDropdown = false;
  }

  onCategoriesClick() {
    this.openCategories.emit();
  }

  onHomeClick() {
    this.goHome.emit();
  }

  onCartClick() {
    if (!this.isLoggedIn) {
      this.openLogin.emit();
    } else {
      this.showCart = !this.showCart;
      this.showUserDropdown = false;
      if (this.showCart) {
        this.cartService.getCart().subscribe();
        this.loadDeliveryCost();
      }
    }
  }

  decreaseQty(item: CartItem) {
    if (item.quantity <= 1) {
      this.removeItem(item);
    } else {
      this.cartService.updateCartItem(item.id, item.quantity - 1).subscribe();
    }
  }

  increaseQty(item: CartItem) {
    this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe();
  }

  removeItem(item: CartItem) {
    this.cartService.removeFromCart(item.id).subscribe();
  }

  onClearCart() {
    if (!this.cartItems || this.cartItems.length === 0) {
      return;
    }
    const confirmed = window.confirm('Remove all items from your cart?');
    if (!confirmed) {
      return;
    }
    this.cartService.clearCart().subscribe(() => {
      this.cartItems = [];
      this.cartTotal = 0;
      this.deliveryCost = null;
      this.deliveryDistanceKm = null;
      this.nearestStoreName = null;
      this.cartItemCount = 0;
    });
  }

  onSearchInput() {
    this.searchInput$.next(this.searchQuery ?? '');
  }

  onSearchAddToCart(beer: Beer, event: MouseEvent) {
    event.stopPropagation();
    if (!this.isLoggedIn) {
      this.showSearchDropdown = false;
      this.openLogin.emit();
      return;
    }
    this.cartService.addToCart(beer.id, 1).subscribe();
  }

  onShowAllResults() {
    if (!this.searchQuery.trim()) return;
    this.showSearchDropdown = false;
    this.searchAll.emit(this.searchQuery.trim());
    this.searchQuery = '';
  }

  onSearchKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') this.onShowAllResults();
    if (event.key === 'Escape') {
      this.showSearchDropdown = false;
      this.searchQuery = '';
    }
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchDropdown = false;
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isScrolled = window.scrollY > 40;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenu = target.closest('.user-menu-container');
    if (!userMenu && this.showUserDropdown) {
      this.showUserDropdown = false;
    }
    const cartMenu = target.closest('.cart-menu-container');
    if (!cartMenu && this.showCart) {
      this.showCart = false;
    }
    const searchBox = target.closest('.search-container');
    if (!searchBox && this.showSearchDropdown) {
      this.showSearchDropdown = false;
    }
  }
}