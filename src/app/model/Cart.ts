export class Cart {
    constructor(
      public idCart: number = 0,
      //public items: CartItem[] = [],
      public totalPrice: number = 0,
      public purchaseDate: string = ""
    ) {}
  }