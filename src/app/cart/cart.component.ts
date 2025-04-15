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
  cartItems: (Product & { quantity?: number, cartId?: string, stockQuantity?: number, showMaxMessage?: boolean })[] = [];
  errorMessage: string = '';
  totalPrice: number = 0;

  constructor(private cartService: CartService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCartById('2');
  }

  loadCartById(cartId: string): void {
    this.cartService.getCart(cartId).subscribe({
      next: (cart: any) => {
        const items = (cart.items ?? [])
          .filter((item: any) => item.product && item.product.name && item.product.price > 0)
          .map((item: any) => ({
            ...item.product,
            quantity: item.quantity,
            cartId: cart.id,
            showMaxMessage: false
          }));

        this.cartItems = items;
        this.loadStockQuantities(); // Charge les stocks à part
      },
      error: (err: any) => {
        console.error("Error loading cart:", err);
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
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0);
  }

  increaseQuantity(item: Product & { quantity?: number, stockQuantity?: number, showMaxMessage?: boolean }) {
    if ((item.quantity ?? 0) < (item.stockQuantity ?? 0)) {
      item.quantity = (item.quantity || 0) + 1;
      item.showMaxMessage = false;
    } else {
      item.showMaxMessage = true;
    }
    this.calculateTotal();
  }

  decreaseQuantity(item: Product & { quantity?: number, idProduct: number, showMaxMessage?: boolean }) {
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
      next: () => {
        this.loadCartById('2');
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du produit.';
        console.error('Error removing product:', err);
      }
    });
  }

  clearCart(): void {
    this.cartItems = [];
    this.totalPrice = 0;
  }
}
