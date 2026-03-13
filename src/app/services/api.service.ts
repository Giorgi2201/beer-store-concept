import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Beer {
  id: number;
  name: string;
  brand: string;
  style: string;
  country: string;
  price: number;
  imageUrl: string;
  description: string;
  alcoholContent: number;
  stockQuantity: number;
  isBestSeller: boolean;
  isLimitedEdition: boolean;
  isNewArrival: boolean;
  categories: string[];
}

export interface BeerFilters {
  styles?: string[];
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  country?: string;
  isBestSeller?: boolean;
  isLimitedEdition?: boolean;
  isNewArrival?: boolean;
  categoryName?: string;
  searchTerm?: string;
  sortBy?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedResult<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  type: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Beer endpoints
  getBeers(filters?: BeerFilters): Observable<PagedResult<Beer>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.styles && filters.styles.length > 0) {
        filters.styles.forEach(style => {
          params = params.append('styles', style);
        });
      }
      if (filters.brands && filters.brands.length > 0) {
        filters.brands.forEach(brand => {
          params = params.append('brands', brand);
        });
      }
      if (filters.minPrice !== undefined) {
        params = params.append('minPrice', filters.minPrice.toString());
      }
      if (filters.maxPrice !== undefined) {
        params = params.append('maxPrice', filters.maxPrice.toString());
      }
      if (filters.country) {
        params = params.append('country', filters.country);
      }
      if (filters.isBestSeller !== undefined) {
        params = params.append('isBestSeller', filters.isBestSeller.toString());
      }
      if (filters.isLimitedEdition !== undefined) {
        params = params.append('isLimitedEdition', filters.isLimitedEdition.toString());
      }
      if (filters.isNewArrival !== undefined) {
        params = params.append('isNewArrival', filters.isNewArrival.toString());
      }
      if (filters.categoryName) {
        params = params.append('categoryName', filters.categoryName);
      }
      if (filters.searchTerm) {
        params = params.append('searchTerm', filters.searchTerm);
      }
      if (filters.sortBy) {
        params = params.append('sortBy', filters.sortBy);
      }
      if (filters.pageNumber !== undefined) {
        params = params.append('pageNumber', filters.pageNumber.toString());
      }
      if (filters.pageSize !== undefined) {
        params = params.append('pageSize', filters.pageSize.toString());
      }
    }

    return this.http.get<PagedResult<Beer>>(`${this.baseUrl}/beers`, { params });
  }

  getBeerById(id: number): Observable<Beer> {
    return this.http.get<Beer>(`${this.baseUrl}/beers/${id}`);
  }

  getAvailableStyles(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/beers/styles`);
  }

  getAvailableBrands(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/beers/brands`);
  }

  getBestSellers(): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.baseUrl}/beers/best-sellers`);
  }

  searchBeers(query: string): Observable<Beer[]> {
    return this.http.get<Beer[]>(`${this.baseUrl}/beers/search`, {
      params: { q: query }
    });
  }

  // Category endpoints
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`);
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/categories/${id}`);
  }
}
