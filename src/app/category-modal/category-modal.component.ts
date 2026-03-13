import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Category } from '../services/api.service';

export interface CategorySelection {
  name: string;
  type: 'main' | 'style';
  filterType?: 'style' | 'brand';
  filterValue?: string;
}

@Component({
  selector: 'app-category-modal',
  imports: [CommonModule],
  templateUrl: './category-modal.component.html',
  styleUrl: './category-modal.component.css'
})
export class CategoryModalComponent implements OnInit, OnDestroy {
  @Output() close = new EventEmitter<void>();
  @Output() selectCategory = new EventEmitter<CategorySelection>();

  mainCategories: Category[] = [];
  styleCategories: Category[] = [];
  isLoading = true;

  private styleIconMap: { [key: string]: string } = {
    'Hefeweizen': '🌾',
    'Dark Lager': '🌑',
    'Märzen': '🍺',
    'Helles': '☀️',
    'Pilsner': '🍻',
    'Dark Wheat': '🌾',
    'Doppelbock': '☕',
    'Lager': '🍺',
    'IPA': '🌿',
    'Stout': '☕',
    'Porter': '🌑',
    'Wheat Beer': '🌾',
    'Sour': '🍋',
  };

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.mainCategories = categories.filter(c => c.type === 'main');
        this.styleCategories = categories.filter(c => c.type === 'style');
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
  }

  getStyleIcon(name: string): string {
    return this.styleIconMap[name] || '🍺';
  }

  onClose() {
    this.close.emit();
  }

  onCategoryClick(category: Category) {
    const isStyle = category.type === 'style';
    const selection: CategorySelection = {
      name: category.name,
      type: isStyle ? 'style' : 'main',
      filterType: isStyle ? 'style' : undefined,
      filterValue: isStyle ? category.name : undefined
    };
    this.selectCategory.emit(selection);
    this.close.emit();
  }
}
