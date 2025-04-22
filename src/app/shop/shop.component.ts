import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { ProductService } from '../service/product.service';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import OpenAI from 'openai';
import { environment } from 'src/environments/environments';
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
  private apikey= environment.apikey;
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
  
  client = new OpenAI({
    baseURL: environment.baseURL,
    apiKey: this.apikey,
    dangerouslyAllowBrowser: true,
  });
  responseHistory: string [] = [];
  responseText: string = '';

  async askQuestion(prompt: string){
    prompt+= `You are an expert in e-commerce and consumer behavior, specializing in baby and maternity products.in a short and brief paragraph, Based on the list of products sold on the website (e.g., baby care, feeding, clothing, maternity items, etc.), analyze customer preferences, purchasing trends, and seasonal demands.

Provide predictions about future bestsellers and suggest strategic recommendations to optimize inventory, enhance marketing campaigns, and improve customer retention.

Your analysis should be structured, insightful, and focused on actionable suggestions that align with current e-commerce trends.`;
    const response = await this.client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1
    }).then((response) => {
      console.log(response.choices[0].message.content);
    })
   
      const raw = await response
    // Affiche immédiatement toute la réponse

    // Test : afficher la réponse après 1 seconde

return null
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

  loadProducts(): void {
    this.isLoading = true;
    this.error = null;
  
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
  
        // Déterminer les prix minimum et maximum
        const prices = products.map(p => p.price);
        this.minPrice = Math.min(...prices);
        this.maxPrice = Math.max(...prices);
  
        // Initialiser les filtres avec les valeurs extrêmes
        this.searchQuery = '';
        this.filteredProducts = [...products];
  
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Échec du chargement des produits';
        this.isLoading = false;
        console.error(err);
      }
    });
  }
  
  filterProducts(): void {
    const query = this.searchQuery?.toLowerCase() || '';
    const min = this.minPrice ?? 0;
    const max = this.maxPrice ?? Infinity;
  
    this.filteredProducts = this.products.filter(product => {
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesPrice = product.price >= min && product.price <= max;
      return matchesName && matchesPrice;
    });
  }
  
}
