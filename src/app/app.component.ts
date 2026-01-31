import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainWebsiteComponent } from './main-website/main-website.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { CategoryModalComponent, CategorySelection } from './category-modal/category-modal.component';
import { CategoryViewComponent } from './category-view/category-view.component';

export interface InitialFilters {
  styles?: string[];
  brands?: string[];
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, FooterComponent, MainWebsiteComponent, LoginModalComponent, CategoryModalComponent, CategoryViewComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild(MainWebsiteComponent) mainWebsite!: MainWebsiteComponent;
  
  showLoginModal = false;
  showCategoryModal = false;
  showCategoryView = false;
  availableStyles: string[] = [];
  
  // Category view data
  selectedCategoryName: string = '';
  categoryBeers: any[] = [];
  initialFilters: InitialFilters = {};

  openLoginModal() {
    this.showLoginModal = true;
  }

  closeLoginModal() {
    this.showLoginModal = false;
  }

  openCategoryModal() {
    // Get available styles from main website component
    if (this.mainWebsite) {
      this.availableStyles = this.mainWebsite.getAvailableStyles();
    }
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
  }

  onCategorySelect(selection: CategorySelection) {
    this.selectedCategoryName = selection.name;
    
    // Get beers for the selected category
    if (this.mainWebsite) {
      // For now, we'll use bestSellers for all categories
      // Later you can add logic to filter by category
      this.categoryBeers = this.mainWebsite.bestSellers;
    }
    
    // Set initial filters based on selection
    this.initialFilters = {};
    
    if (selection.type === 'style' && selection.filterValue) {
      // If a style was selected, pre-select that style filter
      this.initialFilters.styles = [selection.filterValue];
    }
    
    // Switch to category view
    this.showCategoryView = true;
  }

  onBackToHome() {
    this.showCategoryView = false;
    this.selectedCategoryName = '';
    this.categoryBeers = [];
    this.initialFilters = {};
    // Also close any open modals
    this.showLoginModal = false;
    this.showCategoryModal = false;
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
