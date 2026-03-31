import { Component, OnInit, OnDestroy, AfterViewInit, EventEmitter, Output, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Beer } from '../services/api.service';
import { AuthService } from '../services/auth.service';
import { CartService, CartItem } from '../services/cart.service';
import { AddressService } from '../services/address.service';
import { Subscription } from 'rxjs';
import * as L from 'leaflet';

const TBILISI_LAT  = 41.6938;
const TBILISI_LNG  = 44.8015;
const ZONE_KM      = 13.5;

@Component({
  selector: 'app-main-website',
  imports: [CommonModule],
  templateUrl: './main-website.component.html',
  styleUrl: './main-website.component.css'
})
export class MainWebsiteComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output() openLogin   = new EventEmitter<void>();
  @Output() browseBeers = new EventEmitter<void>();

  isLoggedIn = false;
  isLoading  = false;

  bestSellers: Beer[] = [];
  addingToCart: { [beerId: number]: boolean } = {};
  addedToCart:  { [beerId: number]: boolean } = {};
  cartItemMap:  { [beerId: number]: CartItem } = {};
  updatingQty:  { [beerId: number]: boolean } = {};

  openFaqIndex: number | null = null;
  faqItems = [
    {
      q: 'How long does delivery take?',
      a: 'Average delivery time is around 45 minutes from the nearest of our 4 Tbilisi stores to your door — sometimes faster depending on your neighbourhood.'
    },
    {
      q: 'What areas do you deliver to?',
      a: 'We deliver across a 13.5 km radius centred on Tbilisi, covering all major neighbourhoods — Vake, Saburtalo, Isani, Samgori, Didi Dighomi and beyond.'
    },
    {
      q: 'How is the delivery fee calculated?',
      a: 'We find whichever of our 4 stores is closest to your saved address and calculate the fee from there. The maximum you\'ll ever pay is ₾4 — no hidden charges.'
    },
    {
      q: 'Do I need an account to order?',
      a: 'Yes — creating a free account lets you save your delivery address, browse your order history, and check out in seconds every time.'
    },
    {
      q: 'Do you stock Georgian craft beers?',
      a: 'Absolutely. Georgian craft beer is at the heart of what we do. We carry labels like Kacheturi, Baia, Chateau Mukhrani Ale, and more alongside our imported European selection.'
    },
    {
      q: 'Can I update my delivery address?',
      a: 'Yes — head to your Profile page at any time to pick a new address on the map. Delivery costs are recalculated automatically when you add items to your cart.'
    },
  ];

  private cartSub?: Subscription;
  private authSub?: Subscription;
  private fadeObserver?: IntersectionObserver;
  private previewMap: L.Map | null = null;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private cartService: CartService,
    private addressService: AddressService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadBestSellers();

    this.authSub = this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isLoggedIn = isAuth;
      if (isAuth) this.cartService.getCart().subscribe();
    });

    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cartItemMap = {};
      cart?.items?.forEach(item => { this.cartItemMap[item.beerId] = item; });
    });
  }

  ngAfterViewInit() {
    this.fadeObserver = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          this.fadeObserver?.unobserve(e.target);
        }
      }),
      { threshold: 0.1 }
    );
    this.observeFadeEls();
    setTimeout(() => this.initPreviewMap(), 200);
  }

  private initPreviewMap() {
    const container = document.getElementById('preview-map');
    if (!container || this.previewMap) return;

    this.ngZone.runOutsideAngular(() => {
      this.previewMap = L.map('preview-map', {
        center: [TBILISI_LAT, TBILISI_LNG],
        zoom: 11,
        zoomControl: false,
        scrollWheelZoom: false,
        dragging: false,
        touchZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(this.previewMap);

      // Delivery zone circle
      L.circle([TBILISI_LAT, TBILISI_LNG], {
        radius: ZONE_KM * 1000,
        color:       'rgba(212,131,26,0.75)',
        fillColor:   'rgba(212,131,26,0.08)',
        fillOpacity: 1,
        weight: 2,
        dashArray: '6 4',
      }).addTo(this.previewMap);

      // Store markers as amber dots
      this.addressService.getStores().subscribe(stores => {
        stores.forEach(store => {
          const icon = L.divIcon({
            html: `<div style="width:14px;height:14px;border-radius:50%;background:#d4831a;border:2px solid rgba(255,255,255,0.55);box-shadow:0 0 10px rgba(212,131,26,0.7)"></div>`,
            className: '',
            iconSize:   [14, 14],
            iconAnchor: [7, 7],
          });
          L.marker([store.latitude, store.longitude], { icon })
            .bindTooltip(store.name, { permanent: false, direction: 'top' })
            .addTo(this.previewMap!);
        });
      });
    });
  }

  private observeFadeEls() {
    document.querySelectorAll('app-main-website .fade-up').forEach(el => {
      this.fadeObserver?.observe(el);
    });
  }

  loadBestSellers() {
    this.isLoading = true;
    this.apiService.getBestSellers().subscribe({
      next: beers => {
        this.bestSellers = beers;
        this.isLoading = false;
        setTimeout(() => this.observeFadeEls(), 80);
      },
      error: () => {
        this.isLoading = false;
        this.loadFallbackData();
      }
    });
  }

  loadFallbackData() {
    this.bestSellers = [
      { id: 1, name: 'Weissbier', brand: 'Paulaner', style: 'Hefeweizen', country: 'Germany', price: 3.50, imageUrl: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=400', description: '', alcoholContent: 5.5, stockQuantity: 100, isBestSeller: true, isLimitedEdition: false, isNewArrival: false, categories: [] },
      { id: 2, name: 'Dunkel', brand: 'Paulaner', style: 'Dark Lager', country: 'Germany', price: 3.70, imageUrl: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400', description: '', alcoholContent: 4.9, stockQuantity: 80, isBestSeller: true, isLimitedEdition: false, isNewArrival: false, categories: [] },
      { id: 3, name: 'Oktoberfest', brand: 'Paulaner', style: 'Märzen', country: 'Germany', price: 3.90, imageUrl: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=400', description: '', alcoholContent: 5.8, stockQuantity: 60, isBestSeller: false, isLimitedEdition: false, isNewArrival: false, categories: [] }
    ];
    setTimeout(() => this.observeFadeEls(), 80);
  }

  get heroBeers(): Beer[] {
    return this.bestSellers.slice(0, 3);
  }

  toggleFaq(index: number) {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }

  ngOnDestroy() {
    this.cartSub?.unsubscribe();
    this.authSub?.unsubscribe();
    this.fadeObserver?.disconnect();
    if (this.previewMap) {
      this.previewMap.remove();
      this.previewMap = null;
    }
  }

  addToCart(beer: Beer) {
    if (!this.isLoggedIn) { this.openLogin.emit(); return; }
    if (this.addingToCart[beer.id] || this.addedToCart[beer.id]) return;
    this.addingToCart[beer.id] = true;
    this.cartService.addToCart(beer.id, 1).subscribe({
      next: () => {
        this.addingToCart[beer.id] = false;
        this.addedToCart[beer.id]  = true;
        setTimeout(() => { this.addedToCart[beer.id] = false; }, 1600);
      },
      error: err => {
        this.addingToCart[beer.id] = false;
        if (err.status === 401) this.openLogin.emit();
      }
    });
  }

  increaseQty(beerId: number) {
    const item = this.cartItemMap[beerId];
    if (!item || this.updatingQty[beerId]) return;
    this.updatingQty[beerId] = true;
    this.cartService.updateCartItem(item.id, item.quantity + 1).subscribe({
      next: () => { this.updatingQty[beerId] = false; },
      error: () => { this.updatingQty[beerId] = false; }
    });
  }

  decreaseQty(beerId: number) {
    const item = this.cartItemMap[beerId];
    if (!item || this.updatingQty[beerId]) return;
    this.updatingQty[beerId] = true;
    const action = item.quantity <= 1
      ? this.cartService.removeFromCart(item.id)
      : this.cartService.updateCartItem(item.id, item.quantity - 1);
    action.subscribe({
      next: () => { this.updatingQty[beerId] = false; },
      error: () => { this.updatingQty[beerId] = false; }
    });
  }
}
