import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Beer } from '../services/api.service';

interface FilterOptions {
  styles: string[];
  brands: string[];
  priceRange: { min: number; max: number };
}

export interface InitialFilters {
  styles?: string[];
  brands?: string[];
}

@Component({
  selector: 'app-category-view',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-view.component.html',
  styleUrl: './category-view.component.css'
})
export class CategoryViewComponent implements OnInit {
  @Input() categoryName: string = '';
  @Input() beers: Beer[] = [];
  @Input() initialFilters: InitialFilters = {};
  @Output() openLogin = new EventEmitter<void>();

  filteredBeers: Beer[] = [];
  filterOptions: FilterOptions = {
    styles: [],
    brands: [],
    priceRange: { min: 0, max: 100 }
  };

  // Active filters
  selectedStyles: string[] = [];
  selectedBrands: string[] = [];
  minPrice: number = 0;
  maxPrice: number = 100;
  sortBy: string = 'name';

  isLoggedIn = false;

  ngOnInit() {
    this.initializeFilters();
    this.applyInitialFilters();
    this.applyFilters();
  }

  initializeFilters() {
    // Extract unique styles
    this.filterOptions.styles = [...new Set(this.beers.map(b => b.style))].sort();
    
    // Extract unique brands
    this.filterOptions.brands = [...new Set(this.beers.map(b => b.brand))].sort();
    
    // Calculate price range
    const prices = this.beers.map(b => b.price);
    this.filterOptions.priceRange.min = Math.floor(Math.min(...prices));
    this.filterOptions.priceRange.max = Math.ceil(Math.max(...prices));
    
    this.minPrice = this.filterOptions.priceRange.min;
    this.maxPrice = this.filterOptions.priceRange.max;
  }

  applyInitialFilters() {
    // Apply any initial filters passed from the parent component
    if (this.initialFilters.styles && this.initialFilters.styles.length > 0) {
      this.selectedStyles = [...this.initialFilters.styles];
    }
    
    if (this.initialFilters.brands && this.initialFilters.brands.length > 0) {
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
    this.minPrice = this.filterOptions.priceRange.min;
    this.maxPrice = this.filterOptions.priceRange.max;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredBeers = this.beers.filter(beer => {
      // Style filter
      if (this.selectedStyles.length > 0 && !this.selectedStyles.includes(beer.style)) {
        return false;
      }
      
      // Brand filter
      if (this.selectedBrands.length > 0 && !this.selectedBrands.includes(beer.brand)) {
        return false;
      }
      
      // Price filter
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
    } else {
      // TODO: Add cart logic here
    }
  }
}