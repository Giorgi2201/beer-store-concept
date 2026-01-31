import { Component, EventEmitter, Output, Input, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Category {
  name: string;
  icon: string;
  disabled?: boolean;
}

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
export class CategoryModalComponent implements OnInit, OnDestroy, OnChanges {
  @Input() availableStyles: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() selectCategory = new EventEmitter<CategorySelection>();

  mainCategories: Category[] = [
    { name: 'German Beers 🇩🇪', icon: '🍺' },
    { name: 'Craft Beers', icon: '🏭' },
    { name: 'Imported Beers', icon: '🌍' },
    { name: 'Local / Georgian Beers', icon: '🇬🇪' },
    { name: 'Seasonal Specials', icon: '🍂' },
    { name: 'Limited Editions', icon: '⭐' },
    { name: 'Best Sellers', icon: '🏆' },
    { name: 'New Arrivals', icon: '🆕' }
  ];

  styleCategories: Category[] = [];

  // Style icon mapping
  private styleIconMap: { [key: string]: string } = {
    'Hefeweizen': '🌾',
    'Dark Lager': '🌑',
    'Märzen': '🍺',
    'Helles': '☀️',
    'Pilsner': '🍻',
    'Dark Wheat': '🌾',
    'Doppelbock': '☕',
    'Lagers': '🍻',
    'Pilsners': '🍺',
    'IPAs & Pale Ales': '🌿',
    'Stouts & Porters': '☕',
    'Wheat Beers': '🌾',
    'Sour Beers': '🍋',
    'Belgian Ales': '🇧🇪',
    'Dark Beers': '🌑',
    'Light Beers': '☀️'
  };

  ngOnInit() {
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
    this.generateStyleCategories();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['availableStyles'] && !changes['availableStyles'].firstChange) {
      this.generateStyleCategories();
    }
  }

  ngOnDestroy() {
    // Restore body scrolling when modal is closed
    document.body.style.overflow = '';
  }

  generateStyleCategories() {
    this.styleCategories = this.availableStyles.map(style => ({
      name: style,
      icon: this.styleIconMap[style] || '🍺'
    }));
  }

  onClose() {
    this.close.emit();
  }

  onCategoryClick(categoryName: string) {
    // Determine if this is a style category or main category
    const isStyleCategory = this.styleCategories.some(c => c.name === categoryName);
    
    const selection: CategorySelection = {
      name: categoryName,
      type: isStyleCategory ? 'style' : 'main'
    };

    // If it's a style category, add filter information
    if (isStyleCategory) {
      selection.filterType = 'style';
      selection.filterValue = categoryName;
    }

    this.selectCategory.emit(selection);
    this.close.emit();
  }
}
