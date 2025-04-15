import { Product } from './Product';

export class CartItem {
  constructor(
    public id: number,
    public quantity: number,
    public priceAtAddition: number,
    public product: Product
  ) {}
}
