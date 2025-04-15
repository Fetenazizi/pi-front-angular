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
  filteredProducts: Product[] = []; // Liste des produits filtrés
  isLoading = false;
  error: string | null = null;
  
  // Variables pour recherche et filtrage
  searchQuery: string = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  // Méthode pour ajouter un produit au panier
  addToCart(product: Product): void {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        console.log('Produit ajouté au panier');
        this.router.navigate(['/Cart']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout au panier', err);
      }
    });
  }

  // Chargement des produits depuis le service
  loadProducts(): void {
    this.isLoading = true;
    this.error = null;

    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.filteredProducts = products; // Initialement, on affiche tous les produits
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load products';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  // Filtrer les produits en fonction de la recherche et des critères de prix
  filterProducts(): void {
    this.filteredProducts = this.products.filter(product => {
      // Filtrer par nom
      const matchesName = product.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      // Filtrer par prix
      const matchesPrice = 
        (this.minPrice === null || product.price >= this.minPrice) &&
        (this.maxPrice === null || product.price <= this.maxPrice);

      return matchesName && matchesPrice;
    });
  }
}
