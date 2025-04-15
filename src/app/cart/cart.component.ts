// src/app/components/cart/cart.component.ts 
import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { Product } from '../model/Product';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: (Product & { quantity?: number, cartId?: string })[] = [];
  errorMessage: string = '';
  totalPrice: number = 0; // Variable pour stocker le total

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCartById('2'); // Remplace avec le vrai cartId si besoin
  }

  loadCartById(cartId: string): void {
    this.cartService.getCart(cartId).subscribe({
      next: (cart: any) => {
        console.log("✅ Cart received from backend:", cart);
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
            cartId: cart.id
          }));
        this.calculateTotal(); // Recalculer le total à chaque chargement
      },
      error: (err: any) => {
        console.error("Error loading cart:", err);
        this.errorMessage = 'Erreur lors du chargement du panier.';
      }
    });
  }

  // Calculer le total en fonction de la quantité et du prix
  calculateTotal(): void {
    this.totalPrice = this.cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1)); // Calcul total
    }, 0);
  }

  increaseQuantity(item: Product & { quantity?: number }) {
    item.quantity = (item.quantity || 0) + 1;
    this.calculateTotal(); // Recalculer après modification de la quantité
  }

  decreaseQuantity(item: Product & { quantity?: number, idProduct: number }) {
    if (item.quantity && item.quantity > 1) {
      item.quantity--;
    } else if (item.quantity === 1) {
      this.removeFromCart(item.idProduct);
    }
    this.calculateTotal(); // Recalculer après modification de la quantité
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.loadCartById('2');
      },
      error: (err) => {
        this.errorMessage = 'Error removing product from cart';
        console.error('Error removing product:', err);
      }
    });
  }

  clearCart(): void {
    this.cartItems = [];
    this.totalPrice = 0; // Réinitialiser le total
  }
}
