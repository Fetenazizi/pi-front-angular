import { CartItem } from './CartItem';

export class Cart {
  constructor(
    public idCart: number,
    public totalPrice: number,
    public purchaseDate: string,
    public items: CartItem[] = []
  ) {}
}