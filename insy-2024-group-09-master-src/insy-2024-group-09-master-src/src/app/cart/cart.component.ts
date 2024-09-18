import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart-item';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { ImageModule } from 'primeng/image';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [NgFor, NgIf, RouterModule, FormsModule, ImageModule, CommonModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  product?: Product;
  cartItems: CartItem[] = [];
  subtotal: number = 0;
  shipping: number = 4.99; 
  total: number = 0;
  productData: { [itemId: string]: Product } = {};

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  async ngOnInit(): Promise<void> {
    this.cartItems = this.cartService.getAllCartItems();
    await this.fetchProductData(); //await waits for fetching products to finish and then calculates price
    this.calculateTotals();
  }

  async calculateTotals(): Promise<void> {
    this.subtotal = 0; //reset subtotal
    for (const cartItem of this.cartItems) {
      console.log("Processing cart item:", cartItem.id);
      const product = this.productData[cartItem.id];
      if (product) {
        console.log("Price for item " + product.price + ": ");
        this.subtotal += product.price * cartItem.quantity;
        console.log("Updated subtotal:", this.subtotal);
      } else {
        console.warn(`Product data not found for cart item ${cartItem.id}`);
      }
    }
    this.subtotal = parseFloat(this.subtotal.toFixed(2)); //toFixed sets number to have 2 decmals
    this.total = parseFloat((this.subtotal + this.shipping).toFixed(2)); //toFixed sets number to have 2 decmals
    console.log("Total:", this.total);
  }

  removeItem(cartItem: CartItem): void {
    this.cartService.removeCartItem(cartItem);
    this.cartItems = this.cartService.getAllCartItems();
    this.calculateTotals();
  }

  async updateQuantity(item: CartItem): Promise<void> {
    if (item.quantity === 0) {
      this.removeItem(item);
    } else {
      this.cartService.setCartItem(item);
    }
    await this.calculateTotals(); //ensure totals are recalculated again
  }

  async fetchProductData(): Promise<void> {
    const productObservables = this.cartItems.map(item => 
      this.productService.getProductMetadata(item.id).toPromise()
    );
    const products = await Promise.all(productObservables);
    products.forEach(product => {
      if (product) {
        this.productData[product.id] = product;
      }
    });

    console.log("Product data:", this.productData);
  }

  getProductPrice(itemId: string): number {
    const product = this.productData[itemId];
    return product ? product.price : 0;
  }

  getProductName(itemId: string): string {
    const product = this.productData[itemId];
    return product ? product.name : '';
  }
  getProductImage(itemId: string): string {
    const product = this.productData[itemId];
    return product ? product.name : '';
  }

}
