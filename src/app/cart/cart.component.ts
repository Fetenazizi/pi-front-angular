import { Component, OnInit } from '@angular/core';
import { CartService } from '../service/cart.service';
import { HttpClient } from '@angular/common/http';
import { Product } from '../model/Product';
import { PayPalService } from '../service/paypal.service';

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
  phoneNumber: string = '+21655042298'; 

  // Payment properties
  paymentMethods = [
    { id: 'credit', name: '💳 Carte de crédit', selected: true },
    { id: 'paypal', name: '📱 PayPal', selected: false },
    { id: 'bank', name: '🏦 Virement bancaire', selected: false }
  ];
  selectedPaymentMethod: string = 'credit';
  paymentProcessing: boolean = false;
  paymentSuccess: boolean = false;
  orderNumber: string = '';
  paypalLoaded: boolean = false;
  paypalButtonId: string = 'paypal-button-container';

  constructor(
    private cartService: CartService,
    private http: HttpClient,
    private paypalService: PayPalService
  ) {}

  ngOnInit(): void {
    this.loadCartById('2');
    this.loadPayPalScript();
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
    this.paymentSuccess = false;
  }

  async loadPayPalScript(): Promise<void> {
    this.paypalLoaded = await this.paypalService.loadPayPalScript();
    if (this.paypalLoaded) {
      this.renderPayPalButton();
    } else {
      this.errorMessage = 'Failed to load PayPal payment processor. Please try another method.';
    }
  }

  renderPayPalButton(): void {
    if (!this.paypalLoaded || this.cartItems.length === 0) return;

    try {
      this.paypalService.renderButton({
        container: `#${this.paypalButtonId}`,
        amount: this.discountedTotal / 3, // Rough conversion to USD
        onApprove: (details: any) => {
          this.paymentProcessing = false;
          this.paymentSuccess = true;
          this.orderNumber = details.id;
          this.clearCart();
        },
        onError: (err: any) => {
          this.paymentProcessing = false;
          this.errorMessage = 'Payment failed. Please try another payment method.';
          console.error('PayPal error:', err);
        }
      });
    } catch (error) {
      console.error('Error rendering PayPal button:', error);
      this.errorMessage = 'Failed to initialize PayPal. Please try again.';
    }
  }

  processPayment(): void {
    if (this.cartItems.length === 0) {
      this.errorMessage = 'Votre panier est vide.';
      return;
    }

    if (this.selectedPaymentMethod === 'paypal') {
      // PayPal handles its own processing
      return;
    }

    // Handle other payment methods
    this.paymentProcessing = true;
    this.errorMessage = '';

    setTimeout(() => {
     
      this.orderNumber = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
      this.clearCart();
      

      this.http.post(`http://localhost:8089/PI_feten/api/notifications/sms`, null, {
        params: {
          phone: this.phoneNumber,
          orderId: this.orderNumber ,
        }
      }).subscribe({
        next: () => console.log('SMS envoyé avec succès !'),
        error: (err) => console.error('Erreur envoi SMS:', err)
      });
    }, 2000);
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;
    this.paymentMethods.forEach(method => {
      method.selected = method.id === methodId;
    });
    
    // Re-render PayPal button if PayPal is selected
    if (methodId === 'paypal' && this.paypalLoaded) {
      setTimeout(() => this.renderPayPalButton(), 0);
    }
  }
}