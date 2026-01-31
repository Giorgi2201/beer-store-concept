import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  id: number;
  beerId: number;
  beerName: string;
  beerBrand: string;
  beerImageUrl: string;
  quantity: number;
  price: number;
  subtotal: number;
  addedAt: string;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalAmount: number;
  totalItems: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  beerId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.apiUrl;
  private cartSubject = new BehaviorSubject<Cart | null>(null);
  public cart$ = this.cartSubject.asObservable();

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/cart`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  addToCart(beerId: number, quantity: number = 1): Observable<Cart> {
    const request: AddToCartRequest = { beerId, quantity };
    return this.http.post<Cart>(`${this.baseUrl}/cart/items`, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  updateCartItem(itemId: number, quantity: number): Observable<Cart> {
    const request: UpdateCartItemRequest = { quantity };
    return this.http.put<Cart>(`${this.baseUrl}/cart/items/${itemId}`, request)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  removeFromCart(itemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.baseUrl}/cart/items/${itemId}`)
      .pipe(
        tap(cart => this.cartSubject.next(cart))
      );
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/cart`)
      .pipe(
        tap(() => this.cartSubject.next(null))
      );
  }

  getCartItemCount(): number {
    const cart = this.cartSubject.value;
    return cart?.totalItems || 0;
  }
}
