// src/app/models/product.model.ts

export class Product {
  quantity: any;
  constructor(
    public idProduct: number,
    public name: string,
    public description: string,
    public price: number,
public stockQuantity: number,
    public category: string,
    public imageUrl: string,

    
  ) {}
}
