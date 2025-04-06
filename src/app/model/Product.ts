// src/app/models/product.model.ts

export class Product {
    constructor(
      public idProduct: number,
      public name: string,
      public description: string,
      public price: number,
      public stockQuantity: number,
      public category: string
    ) {}
  

  }