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
  cartItems: (Product & { quantity?: number })[] = [];
  errorMessage: string = '';

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
 //   this.loadAllCarts();
 this.loadCartById('2'); // Remplacez 'cartId' par l'ID réel du panier que vous souhaitez charger
  }
  loadAllCarts(): void {
    this.cartService.getAllCarts().subscribe({
      next: (carts) => {
        console.log("✅ Réponse complète reçue depuis le backend :", carts);

        // Filtrage et transformation des données
        this.cartItems = carts.flatMap(cart =>
          (cart.items ?? [])
            .filter((item: { product: { name: string; price: number; description: string } }) => {
              // Filtre les produits avec un nom valide, un prix supérieur à 0 et une description non vide
              return item.product && item.product.name && item.product.price > 0 && item.product.description;
            })
            .map((item: any) => ({
              ...item.product,
              quantity: item.quantity
            }))
        );
      },
     
    });
  }

  loadCartById(cartId: string): void {
    this.cartService.getCart(cartId).subscribe({
      next: (cart:any) => {
        console.log("✅ Cart received from backend:", cart);
  
        // Process items from the single cart
        this.cartItems = (cart.items ?? [])
          .filter((item:any) => {
            return (
              item.product &&
              item.product.name &&
              item.product.price > 0 &&
              item.product.description
            );
          })
          .map((item:any) => ({
            ...item.product,
            quantity: item.quantity,
            // Optional: Include cartId if needed
            cartId: cart.id 
          }));
      },
      error: (err:any) => {
        console.error("Error loading cart:", err);
      }
    });
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {

        // Refresh your cart data after removal
        this.loadCartById('2')
      },
      error: (err) => {
        this.errorMessage = 'Error removing product from cart';
        console.error('Error removing product:', err);
      }
    });
  }

 
  clearCart(): void {
    this.cartItems = [];
  }
}
