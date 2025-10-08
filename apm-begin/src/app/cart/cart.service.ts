import { computed, effect, Injectable, signal } from '@angular/core';
import { CartItem } from './cart';
import { Product } from '../products/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  // eLength = effect(() =>
  //   console.log('Cart array Length is:', this.cartItems().length)
  // );

  cartCount = computed(() =>
    this.cartItems().reduce((accQt, item) => accQt + item.quantity, 0)
  );

  subTotal = computed(() =>
    this.cartItems().reduce(
      (accTotal, item) => accTotal + item.quantity * item.product.price,
      0
    )
  );

  deliveryFee = computed(() => (this.subTotal() < 50 ? 5.99 : 0));

  tax = computed(() => (this.subTotal() * 10.75) / 100);

  totalPrice = computed(
    () => this.subTotal() + this.deliveryFee() + this.tax()
  );

  addToCart(product: Product): void {
    this.cartItems.update((items) => [...items, { product, quantity: 1 }]);
  }

  updateQuantity(cartItem: CartItem, quantity: number): void {
    this.cartItems.update((items) =>
      items.map((item) =>
        item.product.id === cartItem.product.id ? { ...item, quantity } : item
      )
    );
  }

  removeFromCart(cartItem: CartItem): void {
    this.cartItems.update((items) =>
      items.filter((item) => item.product.id !== cartItem.product.id)
    );
  }
}
