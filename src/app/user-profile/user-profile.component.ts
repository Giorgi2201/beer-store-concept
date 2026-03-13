import { Component, EventEmitter, Output, OnInit, OnDestroy, AfterViewInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { AddressService, StoreLocation, DeliveryQuoteResult } from '../services/address.service';
import { environment } from '../../environments/environment';
import * as L from 'leaflet';

// Fix Leaflet default marker icon paths (broken in webpack builds)
const iconDefault = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

// Tbilisi centre and zone radius — only used for map rendering (not for business calculations)
const TBILISI_CENTER_LAT = 41.6938;
const TBILISI_CENTER_LNG = 44.8015;
const DELIVERY_ZONE_KM   = 13.5;

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() back = new EventEmitter<void>();

  userInfo = { firstName: '', lastName: '', email: '', createdAt: '' };
  originalUserInfo = { ...this.userInfo };
  editMode = false;
  isSavingProfile = false;

  passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  isChangingPassword = false;

  // Address state
  addressLine = '';
  phone = '';
  selectedLat: number | null = null;
  selectedLng: number | null = null;
  deliveryQuote: DeliveryQuoteResult | null = null;
  addressSearchQuery = '';
  searchResults: any[] = [];
  isSavingAddress = false;
  locationError = '';

  profilePicture: string | null = null;
  defaultProfilePicture = 'https://placehold.co/200x200/8b6914/f5e6d3?text=U';

  successMessage = '';
  errorMessage = '';

  private map: L.Map | null = null;
  private userMarker: L.Marker | null = null;
  private storeMarkers: L.Marker[] = [];
  private zoneCircle: L.Circle | null = null;
  private apiUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private addressService: AddressService,
    private http: HttpClient,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.userInfo = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          createdAt: user.createdAt
        };
        this.originalUserInfo = { ...this.userInfo };
        if ((user as any).addressLine) this.addressLine = (user as any).addressLine;
        if ((user as any).phone) this.phone = (user as any).phone;
        if ((user as any).latitude && (user as any).longitude) {
          this.selectedLat = (user as any).latitude;
          this.selectedLng = (user as any).longitude;
          this.updateDeliveryCost();
        }
      }
    });
    this.loadProfilePicture();
  }

  ngAfterViewInit() {
    setTimeout(() => this.initMap(), 100);
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }
  }

  // ─── Map ─────────────────────────────────────────────────────────────────

  private initMap() {
    const mapEl = document.getElementById('delivery-map');
    if (!mapEl || this.map) return;

    this.map = L.map('delivery-map', {
      center: [41.720, 44.800],
      zoom: 12
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(this.map);

    // Delivery zone circle (visual only — actual zone check is server-side)
    this.zoneCircle = L.circle([TBILISI_CENTER_LAT, TBILISI_CENTER_LNG], {
      radius: DELIVERY_ZONE_KM * 1000,
      color: '#8b6914',
      fillColor: '#c9a227',
      fillOpacity: 0.07,
      weight: 2,
      dashArray: '8 5'
    }).addTo(this.map);

    const storeIcon = L.divIcon({
      html: '<div class="store-marker-icon">🍺</div>',
      className: 'store-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18]
    });

    // Load store locations from the API
    this.addressService.getStores().subscribe({
      next: (stores) => {
        stores.forEach(store => {
          const marker = L.marker([store.latitude, store.longitude], { icon: storeIcon })
            .addTo(this.map!)
            .bindPopup(`<b>🍺 ${store.name}</b>`);
          this.storeMarkers.push(marker);
        });
      }
    });

    if (this.selectedLat && this.selectedLng) {
      this.placeUserMarker(this.selectedLat, this.selectedLng);
    }

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.ngZone.run(() => this.pickLocation(e.latlng.lat, e.latlng.lng));
    });
  }

  private placeUserMarker(lat: number, lng: number) {
    if (!this.map) return;
    if (this.userMarker) this.userMarker.remove();

    this.userMarker = L.marker([lat, lng], { draggable: true })
      .addTo(this.map)
      .bindPopup('Your delivery address');

    this.userMarker.on('dragend', (e: any) => {
      this.ngZone.run(() => {
        const pos = e.target.getLatLng();
        this.pickLocation(pos.lat, pos.lng);
      });
    });
  }

  /**
   * Returns true if the Nominatim reverse-geocode result represents a populated /
   * addressable location. Rejects mountains, forests, water, and uninhabited features.
   */
  private isHabitableLocation(result: any): boolean {
    if (!result) return false;
    const uninhabitedClasses = ['natural', 'waterway', 'water'];
    const uninhabitedTypes   = [
      'peak', 'ridge', 'cliff', 'valley', 'mountain_range',
      'forest', 'wood', 'scrub', 'heath', 'grassland',
      'farmland', 'orchard', 'vineyard', 'wetland',
      'river', 'stream', 'lake', 'reservoir', 'bay'
    ];
    if (uninhabitedClasses.includes(result.class)) return false;
    if (uninhabitedTypes.includes(result.type))    return false;
    const addr = result.address || {};
    const habitableKeys = [
      'road', 'pedestrian', 'footway', 'cycleway', 'path',
      'residential', 'house_number', 'building',
      'suburb', 'neighbourhood', 'quarter',
      'city_district', 'district', 'borough',
      'village', 'town', 'city'
    ];
    return habitableKeys.some(k => !!addr[k]);
  }

  private pickLocation(lat: number, lng: number) {
    this.locationError = '';
    this.addressService.reverseGeocode(lat, lng).subscribe({
      next: (result) => {
        if (!this.isHabitableLocation(result)) {
          this.locationError = 'Please select a street or residential area, not a mountain or uninhabited zone.';
          if (this.userMarker) { this.userMarker.remove(); this.userMarker = null; }
          this.selectedLat = null;
          this.selectedLng = null;
          this.deliveryQuote = null;
          return;
        }
        this.selectedLat = lat;
        this.selectedLng = lng;
        this.placeUserMarker(lat, lng);
        this.updateDeliveryCost();

        const addr = result.address;
        if (addr) {
          const parts = [
            addr.road || addr.pedestrian || addr.footway,
            addr.house_number,
            addr.suburb || addr.neighbourhood || addr.village || addr.town
          ].filter(Boolean);
          this.addressLine = parts.join(', ') || result.display_name;
        } else {
          this.addressLine = result.display_name || '';
        }
      },
      error: () => {
        this.selectedLat = lat;
        this.selectedLng = lng;
        this.placeUserMarker(lat, lng);
        this.updateDeliveryCost();
      }
    });
  }

  private updateDeliveryCost() {
    if (this.selectedLat == null || this.selectedLng == null) return;
    this.addressService.getDeliveryQuote(this.selectedLat, this.selectedLng).subscribe({
      next: (quote) => {
        this.deliveryQuote = quote;
        this.zoneCircle?.setStyle({
          color:       quote.inZone ? '#8b6914' : '#cc3333',
          fillColor:   quote.inZone ? '#c9a227' : '#cc3333',
          fillOpacity: quote.inZone ? 0.07 : 0.10
        });
      }
    });
  }

  searchAddress() {
    if (!this.addressSearchQuery.trim()) return;
    this.addressService.geocodeAddress(this.addressSearchQuery).subscribe({
      next: (results) => { this.searchResults = results; },
      error: () => { this.searchResults = []; }
    });
  }

  selectSearchResult(result: any) {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    this.addressSearchQuery = '';
    this.searchResults = [];
    this.map?.setView([lat, lng], 16);
    this.pickLocation(lat, lng);
  }

  saveAddress() {
    if (!this.selectedLat || !this.selectedLng) {
      this.showErrorMessage('Please select your address on the map first.');
      return;
    }
    if (this.deliveryQuote && !this.deliveryQuote.inZone) {
      this.showErrorMessage('Selected address is outside our delivery zone.');
      return;
    }

    this.isSavingAddress = true;
    this.addressService.saveAddress({
      addressLine: this.addressLine,
      phone: this.phone,
      latitude: this.selectedLat,
      longitude: this.selectedLng
    }).subscribe({
      next: (updatedUser: any) => {
        this.isSavingAddress = false;
        const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
        const raw = storage.getItem('currentUser');
        if (raw) {
          const user = JSON.parse(raw);
          user.addressLine = this.addressLine;
          user.phone       = this.phone;
          user.latitude    = this.selectedLat;
          user.longitude   = this.selectedLng;
          storage.setItem('currentUser', JSON.stringify(user));
        }
        const cost  = this.deliveryQuote?.cost?.toFixed(2) ?? '?';
        const store = this.deliveryQuote?.nearestStoreName ?? '';
        this.showSuccessMessage(`Address saved! Delivering from ${store} — ₾${cost}`);
      },
      error: (err) => {
        this.isSavingAddress = false;
        const msg = err?.error?.error || 'Failed to save address. Please try again.';
        this.showErrorMessage(msg);
      }
    });
  }

  // ─── Profile ──────────────────────────────────────────────────────────────

  loadProfilePicture() {
    const saved = localStorage.getItem('profilePicture');
    if (saved) this.profilePicture = saved;
  }

  enableEditMode() { this.editMode = true; }

  cancelEdit() {
    this.userInfo = { ...this.originalUserInfo };
    this.editMode = false;
  }

  saveUserInfo() {
    if (!this.userInfo.firstName.trim() || !this.userInfo.lastName.trim()) {
      this.showErrorMessage('First and last name are required.');
      return;
    }
    this.isSavingProfile = true;
    this.http.put<any>(`${this.apiUrl}/auth/profile`, {
      firstName: this.userInfo.firstName.trim(),
      lastName:  this.userInfo.lastName.trim()
    }).subscribe({
      next: (updatedUser) => {
        this.isSavingProfile = false;
        this.originalUserInfo = { ...this.userInfo };
        this.editMode = false;
        // Update stored user so the header name refreshes
        const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
        const raw = storage.getItem('currentUser');
        if (raw) {
          const user = JSON.parse(raw);
          user.firstName = updatedUser.firstName;
          user.lastName  = updatedUser.lastName;
          storage.setItem('currentUser', JSON.stringify(user));
          this.authService.refreshUserFromStorage();
        }
        this.showSuccessMessage('Profile updated successfully!');
      },
      error: (err) => {
        this.isSavingProfile = false;
        this.showErrorMessage(err?.error?.error || 'Failed to update profile.');
      }
    });
  }

  // ─── Password ─────────────────────────────────────────────────────────────

  get passwordRequirements() {
    return {
      minLength:      this.passwordForm.newPassword.length >= 8,
      hasCapital:     /[A-Z]/.test(this.passwordForm.newPassword),
      hasNumber:      /[0-9]/.test(this.passwordForm.newPassword),
      passwordsMatch: this.passwordForm.newPassword === this.passwordForm.confirmPassword
                      && this.passwordForm.confirmPassword !== ''
    };
  }

  isPasswordValid(): boolean {
    return this.passwordForm.currentPassword !== ''
        && this.passwordRequirements.minLength
        && this.passwordRequirements.hasCapital
        && this.passwordRequirements.hasNumber
        && this.passwordRequirements.passwordsMatch;
  }

  changePassword() {
    if (!this.isPasswordValid()) {
      this.showErrorMessage('Please meet all password requirements.');
      return;
    }
    this.isChangingPassword = true;
    this.http.post(`${this.apiUrl}/auth/change-password`, {
      currentPassword: this.passwordForm.currentPassword,
      newPassword:     this.passwordForm.newPassword
    }).subscribe({
      next: () => {
        this.isChangingPassword = false;
        this.passwordForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
        this.showSuccessMessage('Password changed successfully!');
      },
      error: (err) => {
        this.isChangingPassword = false;
        this.showErrorMessage(err?.error?.error || 'Failed to change password.');
      }
    });
  }

  onProfilePictureChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePicture = e.target.result;
        localStorage.setItem('profilePicture', e.target.result);
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'profilePicture',
          newValue: e.target.result
        }));
        this.showSuccessMessage('Profile picture updated!');
      };
      reader.readAsDataURL(file);
    }
  }

  showSuccessMessage(msg: string) {
    this.successMessage = msg;
    this.errorMessage = '';
    setTimeout(() => { this.successMessage = ''; }, 4000);
  }

  showErrorMessage(msg: string) {
    this.errorMessage = msg;
    this.successMessage = '';
    setTimeout(() => { this.errorMessage = ''; }, 4000);
  }

  goBack() { this.back.emit(); }
}
