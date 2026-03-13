import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AddressData {
  addressLine: string | null;
  phone: string | null;
  latitude: number | null;
  longitude: number | null;
}

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export interface StoreLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface DeliveryQuoteResult {
  cost: number;
  distanceKm: number;
  inZone: boolean;
  nearestStoreName: string;
  nearestStoreId: number;
}

@Injectable({ providedIn: 'root' })
export class AddressService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  saveAddress(data: AddressData): Observable<any> {
    return this.http.put(`${this.apiUrl}/auth/address`, data);
  }

  getStores(): Observable<StoreLocation[]> {
    return this.http.get<StoreLocation[]>(`${this.apiUrl}/delivery/stores`);
  }

  getDeliveryQuote(latitude: number, longitude: number): Observable<DeliveryQuoteResult> {
    return this.http.post<DeliveryQuoteResult>(`${this.apiUrl}/delivery/quote`, { latitude, longitude });
  }

  /**
   * Geocode a text address using Nominatim (OpenStreetMap) — free, no API key needed.
   * Biased to Tbilisi, Georgia.
   */
  geocodeAddress(query: string): Observable<NominatimResult[]> {
    const params = new URLSearchParams({
      q: `${query}, Tbilisi, Georgia`,
      format: 'json',
      limit: '5',
      countrycodes: 'ge',
      viewbox: '44.68,41.82,44.91,41.62',
      bounded: '1'
    });
    return this.http.get<NominatimResult[]>(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { 'Accept-Language': 'en' } }
    );
  }

  /**
   * Reverse geocode coordinates to an address using Nominatim.
   */
  reverseGeocode(lat: number, lng: number): Observable<any> {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString(),
      format: 'json'
    });
    return this.http.get<any>(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      { headers: { 'Accept-Language': 'en' } }
    );
  }
}
