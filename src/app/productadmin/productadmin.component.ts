import { Component, OnInit } from '@angular/core';
import { Product } from '../model/Product';
import { ProductService } from '../service/product.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-productadmin',
  templateUrl: './productadmin.component.html',
  styleUrls: ['./productadmin.component.css']
})
export class ProductAdminComponent implements OnInit {
  products: Product[] = [];
  selectedProduct: Product | null = null;
  isEditing = false;
  isLoading = false;
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  showCameraPreview = false;
  private videoStream: MediaStream | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    });
  }
  async saveProduct() {
    if (!this.selectedProduct) return;
  
    this.isLoading = true;
  
    try {
      // Upload image first if exists
      if (this.selectedImage) {
        this.selectedProduct.imageUrl = await lastValueFrom(
          this.productService.uploadImage(this.selectedImage)
        );
      }
  
      // Then create product
      const save$ = this.isEditing && this.selectedProduct.idProduct
        ? this.productService.updateProduct(this.selectedProduct, this.selectedProduct.idProduct)
        : this.productService.createProduct(this.selectedProduct);
  
      await lastValueFrom(save$);
      this.loadProducts();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving product:', error);
      this.isLoading = false;
    }
  }


  startEdit(product: Product): void {
    this.selectedProduct = { ...product };
    this.isEditing = true;
    if (product.imageUrl) {
      this.imagePreview = product.imageUrl;
    }
  }

  startAdd(): void {
    this.selectedProduct = { 
      idProduct: 0, 
      name: '', 
      description: '', 
      category: '',
      stockQuantity: 0,
      price: 0,
      imageUrl: ''
    };
    this.isEditing = false;
    this.imagePreview = null;
  }

  cancelEdit(): void {
    this.selectedProduct = null;
    this.isEditing = false;
    this.selectedImage = null;
    this.imagePreview = null;
    this.stopCamera();
  }

  deleteProduct(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.isLoading = true;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.handleImageFile(file);
    }
  }

  startCamera(): void {
    this.showCameraPreview = true;
    
    // Wait for the view to update
    setTimeout(() => {
      const cameraPreviewElement = document.getElementById('camera-preview') as HTMLVideoElement;
      this.initializeCamera(cameraPreviewElement);
    });
  }

  private initializeCamera(videoElement: HTMLVideoElement): void {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
          this.videoStream = stream;
          videoElement.srcObject = stream;
        })
        .catch(error => {
          console.error('Camera error: ', error);
          // Fall back to file input if camera fails
          this.showCameraPreview = false;
          document.getElementById('productImage')?.click();
        });
    } else {
      // Browser doesn't support camera API, fall back to file input
      this.showCameraPreview = false;
      document.getElementById('productImage')?.click();
    }
  }

  capturePhoto(): void {
    const cameraPreviewElement = document.getElementById('camera-preview') as HTMLVideoElement;
    if (!cameraPreviewElement) return;

    const canvas = document.createElement('canvas');
    canvas.width = cameraPreviewElement.videoWidth;
    canvas.height = cameraPreviewElement.videoHeight;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.drawImage(cameraPreviewElement, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'captured-photo.jpg', { type: 'image/jpeg' });
          this.handleImageFile(file);
        }
      }, 'image/jpeg');
    }

    this.stopCamera();
  }

  stopCamera(): void {
    if (this.videoStream) {
      this.videoStream.getTracks().forEach(track => track.stop());
      this.videoStream = null;
    }
    this.showCameraPreview = false;
  }

  private handleImageFile(file: File): void {
    this.selectedImage = file;
    
    // Create a preview of the image
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      if (this.selectedProduct) {
        this.selectedProduct.imageUrl = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.stopCamera();
  }
}