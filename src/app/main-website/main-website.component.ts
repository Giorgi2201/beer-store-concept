import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Beer } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-main-website',
  imports: [CommonModule],
  templateUrl: './main-website.component.html',
  styleUrl: './main-website.component.css'
})
export class MainWebsiteComponent implements OnInit, OnDestroy {
  @Output() openLogin = new EventEmitter<void>();
  
  private intervalId: any;
  selectedCategory: string | null = null;
  isLoggedIn = false;
  isLoading = false;
  
  // Beer catalog data
  bestSellers: Beer[] = [];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.startQuoteRotation();
    this.loadBestSellers();

    // Subscribe to auth status
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
    });
  }

  loadBestSellers() {
    this.isLoading = true;
    this.apiService.getBestSellers().subscribe({
      next: (beers) => {
        this.bestSellers = beers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading best sellers:', err);
        this.isLoading = false;
        // Keep the hardcoded fallback data
        this.loadFallbackData();
      }
    });
  }

  loadFallbackData() {
    // Fallback data in case API is not available
    this.bestSellers = [
      { id: 1, name: 'Weissbier', brand: 'Paulaner', style: 'Hefeweizen', country: 'Germany', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', description: 'Classic Bavarian wheat beer', alcoholContent: 5.5, stockQuantity: 100, isBestSeller: true, isLimitedEdition: false, isNewArrival: false, categories: [] },
      { id: 2, name: 'Dunkel', brand: 'Paulaner', style: 'Dark Lager', country: 'Germany', price: 3.70, imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', description: 'Dark Munich lager', alcoholContent: 4.9, stockQuantity: 80, isBestSeller: true, isLimitedEdition: false, isNewArrival: false, categories: [] },
      { id: 3, name: 'Oktoberfest', brand: 'Paulaner', style: 'Märzen', country: 'Germany', price: 3.90, imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400', description: 'Festive Märzen beer', alcoholContent: 5.8, stockQuantity: 60, isBestSeller: false, isLimitedEdition: false, isNewArrival: false, categories: [] }
    ];
  }

  getAvailableStyles(): string[] {
    if (!this.bestSellers || this.bestSellers.length === 0) {
      return [];
    }
    const styles = [...new Set(this.bestSellers.map(beer => beer.style))];
    return styles.sort();
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  startQuoteRotation() {
    this.intervalId = setInterval(() => {
      const quotes = document.querySelectorAll('.quote-slide');
      let activeIndex = -1;
      
      // Find current active quote
      quotes.forEach((quote, index) => {
        if (quote.classList.contains('active')) {
          activeIndex = index;
          quote.classList.remove('active');
        }
      });
      
      // Move to next quote (loop back to 0 if at end)
      const nextIndex = (activeIndex + 1) % quotes.length;
      quotes[nextIndex].classList.add('active');
    }, 10000); // 10 seconds
  }

  selectCategory(category: string) {
    this.selectedCategory = category;
    // Scroll to catalog section
    setTimeout(() => {
      const catalog = document.querySelector('.beer-catalog');
      if (catalog) {
        catalog.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  closeCategory() {
    this.selectedCategory = null;
  }

  getCurrentBeers(): Beer[] {
    switch (this.selectedCategory) {
      case 'Best Sellers':
        return this.bestSellers;
      // Add more categories here later
      default:
        return [];
    }
  }

  addToCart(beer: Beer) {
    if (!this.isLoggedIn) {
      this.openLogin.emit();
      return;
    }

    this.cartService.addToCart(beer.id, 1).subscribe({
      next: () => {
        alert(`${beer.name} added to cart!`);
      },
      error: (err) => {
        console.error('Error adding to cart:', err);
        if (err.status === 401) {
          this.openLogin.emit();
        } else {
          alert('Failed to add item to cart. Please try again.');
        }
      }
    });
  }
}
