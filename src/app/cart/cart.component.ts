import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: (Product & {
    quantity?: number;
    cartId?: string;
    stockQuantity?: number;
    showMaxMessage?: boolean;
    promotionPercentage?: number;
  })[] = [];
  errorMessage: string = '';
  rawTotal: number = 0;
  discountedTotal: number = 0;
  autoDiscountApplied: boolean = false;
  discountRate: number = 0;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCartById('2');
  }

  loadCartById(cartId: string): void {
    this.cartService.getCart(cartId).subscribe({
      next: (cart: any) => {
        this.cartItems = (cart.items ?? [])
          .filter((item: any) =>
            item.product &&
            item.product.name &&
            item.product.price > 0 &&
            item.product.description
          )
          .map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            cartId: cart.id,
            promotionPercentage: item.product.promotionPercentage || 0,
            showMaxMessage: false
          }));
        this.loadStockQuantities();
      },
      error: (err: any) => {
        console.error("Erreur lors du chargement du panier:", err);
        this.errorMessage = 'Erreur lors du chargement du panier.';
      }
    });
  }

  loadStockQuantities(): void {
    this.http.get<Product[]>('http://localhost:8089/PI_feten/api/products').subscribe({
      next: (products: Product[]) => {
        this.cartItems.forEach(item => {
          const matchingProduct = products.find(p => p.idProduct === item.idProduct);
          item.stockQuantity = matchingProduct?.stockQuantity ?? 0;
        });
        this.calculateTotal();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des stocks:', err);
        this.errorMessage = 'Erreur lors du chargement des stocks.';
      }
    });
  }

  calculateTotal(): void {
    this.rawTotal = this.cartItems.reduce((total, item) => {
      const promo = item.promotionPercentage || 0;
      const discountedPrice = item.price * (1 - promo / 100);
      return total + discountedPrice * (item.quantity || 1);
    }, 0);

    if (this.rawTotal > 1200) {
      this.discountRate = 40;
    } else if (this.rawTotal > 800) {
      this.discountRate = 25;
    } else if (this.rawTotal > 500) {
      this.discountRate = 15;
    } else {
      this.discountRate = 0;
    }

    this.autoDiscountApplied = this.discountRate > 0;
    this.discountedTotal = this.rawTotal * (1 - this.discountRate / 100);
  }

  increaseQuantity(item: Product & { quantity?: number; stockQuantity?: number; showMaxMessage?: boolean }) {
    if ((item.quantity ?? 0) < (item.stockQuantity ?? 0)) {
      item.quantity = (item.quantity || 0) + 1;
      item.showMaxMessage = false;
    } else {
      item.showMaxMessage = true;
    }
    this.calculateTotal();
  }

  decreaseQuantity(item: Product & { quantity?: number; idProduct: number; showMaxMessage?: boolean }) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else if (item.quantity === 1) {
      this.removeFromCart(item.idProduct);
    }
    item.showMaxMessage = false;
    this.calculateTotal();
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => this.loadCartById('2'),
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du produit.';
        console.error('Erreur suppression:', err);
      }
    });
  }

  clearCart(): void {
    this.cartItems = [];
    this.rawTotal = 0;
    this.discountedTotal = 0;
    this.discountRate = 0;
    this.autoDiscountApplied = false;
  }
}
