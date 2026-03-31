import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainWebsiteComponent } from './main-website/main-website.component';
import { LoginModalComponent } from './login-modal/login-modal.component';
import { CategoryModalComponent, CategorySelection } from './category-modal/category-modal.component';
import { CategoryViewComponent } from './category-view/category-view.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export interface InitialFilters {
  styles?: string[];
  brands?: string[];
  searchTerm?: string;
  categoryName?: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, HeaderComponent, FooterComponent, MainWebsiteComponent, LoginModalComponent, CategoryModalComponent, CategoryViewComponent, UserProfileComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {
  showLoginModal = false;
  showCategoryModal = false;
  showCategoryView = false;
  showProfileView = false;

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
    this.showCategoryModal = true;
  }

  closeCategoryModal() {
    this.showCategoryModal = false;
  }

  onCategorySelect(selection: CategorySelection) {
    this.selectedCategoryName = selection.name;
    this.categoryBeers = [];
    this.initialFilters = {};

    if (selection.type === 'style' && selection.filterValue) {
      this.initialFilters.styles = [selection.filterValue];
    } else {
      this.initialFilters.categoryName = selection.name;
    }

    // Briefly destroy and recreate the category view so ngOnInit always re-runs
    // (needed when switching categories while already on the category view)
    this.showCategoryView = false;
    this.showProfileView = false;
    setTimeout(() => {
      this.showCategoryView = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  onBackToHome() {
    this.showCategoryView = false;
    this.showProfileView = false;
    this.selectedCategoryName = '';
    this.categoryBeers = [];
    this.initialFilters = {};
    this.showLoginModal = false;
    this.showCategoryModal = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  openProfileView() {
    this.showProfileView = true;
    this.showCategoryView = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onSearchAll(searchTerm: string) {
    this.selectedCategoryName = `Search: "${searchTerm}"`;
    this.categoryBeers = [];
    this.initialFilters = { searchTerm };
    this.showCategoryView = false;
    this.showProfileView = false;
    setTimeout(() => {
      this.showCategoryView = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }

  onBrowseAllBeers() {
    this.selectedCategoryName = 'All Beers';
    this.categoryBeers = [];
    this.initialFilters = {};
    this.showCategoryView = false;
    this.showProfileView = false;
    setTimeout(() => {
      this.showCategoryView = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
  }
}
