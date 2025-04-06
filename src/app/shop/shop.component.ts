
// src/app/shop/shop.component.ts
import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {
  products: Product[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        console.log('Produit ajouté au panier');
        this.router.navigate(['/cart']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout au panier', err);
      }
    });
  }

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
}












/*import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
  export class ShopComponent implements OnInit {
    // Définition de la liste des produits
    productss = [
      { name: 'Biberon Anti-Colique', price: 15, image: 'assets/biberon.jpg' },
      { name: 'Poussette Bébé', price: 250, image: 'assets/poussette.jpg' },
      { name: 'Chaise Haute', price: 80, image: 'assets/chaise-haute.jpg' }
    ];
    products: Product[] = [];
  isLoading = false;
  error: string | null = null;
  
  constructor(private productService: ProductService) {}
  
    ngOnInit(): void {
      this.loadProducts();
      // Ce code sera exécuté lorsque le composant sera initialisé
    }
  
    // Méthode pour ajouter un produit au panier
    addToCart(product: any): void {
      console.log(`Produit ajouté : ${product.name}`);
    }
  
    loadProducts(): void {
      this.isLoading = true;
      this.error = null;
      
      this.productService.getAllProducts().subscribe({
        next: (products) => {
          this.products = products;
          this.isLoading = false;
        //  console.error(products);
        },
        error: (err) => {
          this.error = 'Failed to load products';
          this.isLoading = false;
          console.error(err);
        }
      });
    }

    
}*/
