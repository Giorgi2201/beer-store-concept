import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() openLogin = new EventEmitter<void>();
  @Output() openCategories = new EventEmitter<void>();
  @Output() goHome = new EventEmitter<void>();
  
  isLoggedIn = false;
  cartItemCount = 0;
  currentUserName = '';

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    // Subscribe to authentication status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      if (isAuth) {
        this.loadCart();
      } else {
        this.cartItemCount = 0;
      }
    });

    // Subscribe to current user
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.currentUserName = user.firstName;
      } else {
        this.currentUserName = '';
      }
    });

    // Subscribe to cart updates
    this.cartService.cart$.subscribe(cart => {
      this.cartItemCount = cart?.totalItems || 0;
    });
  }

  loadCart() {
    if (this.isLoggedIn) {
      this.cartService.getCart().subscribe({
        error: (err) => console.error('Error loading cart:', err)
      });
    }
  }

  onLoginClick() {
    if (this.isLoggedIn) {
      // Show user menu or logout
      if (confirm('Do you want to logout?')) {
        this.authService.logout();
      }
    } else {
      this.openLogin.emit();
    }
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
      // TODO: Navigate to cart page or show cart modal
      alert('Cart functionality will be added soon!');
    }
  }
}