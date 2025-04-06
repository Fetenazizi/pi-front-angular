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
    cart: Product[] = [
      {
        idProduct: 1,
        name: 'Body bébé',
        description: 'Un body confortable pour bébé.',
        price: 19.99,
        stockQuantity: 10,
        category: 'Vêtements'
      },
      {
        idProduct: 2,
        name: 'Chaussures bébé',
        description: 'Petites chaussures stylées.',
        price: 29.99,
        stockQuantity: 5,
        category: 'Chaussures'
      }
    ]; // Ajout d'objets statiques
  
    constructor() {}
  
    ngOnInit() {}
  
    clearCart() {
      this.cart = []; // Réinitialiser le panier
    }
  }


