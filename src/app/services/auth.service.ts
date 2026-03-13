import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  isOver18: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResponse {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  tokenExpiration: string;
  refreshToken?: string;
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  lastLoginAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    // Restore session from storage without making any HTTP calls
    // (HTTP calls in constructor cause circular DI with authInterceptor)
    if (this.isLoggedIn()) {
      const user = this.getUserFromStorage();
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } else {
      // Token expired or missing — clean up silently
      this.clearStorage();
    }
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response, true))
      );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(
        tap(response => this.handleAuthResponse(response, data.rememberMe))
      );
  }

  logout(): void {
    this.clearStorage();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/auth/me`)
      .pipe(
        tap(user => this.currentUserSubject.next(user))
      );
  }

  getToken(): string | null {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) return false;

    const expiration = localStorage.getItem('tokenExpiration') || sessionStorage.getItem('tokenExpiration');
    if (!expiration) return false;

    return new Date(expiration) > new Date();
  }

  /** Re-reads the currentUser from storage and pushes it to the observable.
   *  Call this after manually updating the stored user object (e.g. after a profile update). */
  refreshUserFromStorage(): void {
    const user = this.getUserFromStorage();
    if (user) this.currentUserSubject.next(user);
  }

  private getUserFromStorage(): User | null {
    const raw = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  private clearStorage(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('tokenExpiration');
    sessionStorage.removeItem('currentUser');
  }

  private handleAuthResponse(response: AuthResponse, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;

    const expirationDate = new Date();
    if (rememberMe) {
      expirationDate.setDate(expirationDate.getDate() + 14);
    } else {
      expirationDate.setTime(new Date(response.tokenExpiration).getTime());
    }

    // Clear both storages first
    this.clearStorage();

    const user: User = {
      id: response.userId,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,
      createdAt: new Date().toISOString()
    };

    storage.setItem('token', response.token);
    storage.setItem('tokenExpiration', expirationDate.toISOString());
    storage.setItem('currentUser', JSON.stringify(user));

    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }
}
