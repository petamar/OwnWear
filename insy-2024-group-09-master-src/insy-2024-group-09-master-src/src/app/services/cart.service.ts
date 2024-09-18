import { Injectable } from '@angular/core';
import { CartItem } from './cart-item';
import { Subject } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class CartService {
    items: CartItem[] = [];
    cartItemsChanged: Subject<void> = new Subject<void>();


    constructor() {
        // Retrieve items from localStore when site is reloaded.
        const stored = localStorage.getItem('cartItems');
        if (stored)
            this.items = JSON.parse(stored);
    }

    /**
     * Checks if two CartItems are equal based on their id, color, and size.
     * 
     * We disregard quantity in the equality check as this does not make an item unique.
     * @param first - The first CartItem to compare.
     * @param second - The second CartItem to compare.
     * @returns True if the CartItems are equal, false otherwise.
     */
    private isEquals(first: CartItem, second: CartItem): boolean {
        return (
            first.id === second.id &&
            first.color === second.color &&
            first.size === second.size
        );
    }
    
    /**
     * Adds a product to the cart.
     * 
     * If the item already exists in the cart, the quantity is updated.
     * If the item does not exist, it is added to the cart.
     * @param item The cart item to be added.
     */
    addCartItem(item: CartItem): void {
        const existingItem = this.items.find(
            (existing) =>
                this.isEquals(existing, item)
        );
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            this.items.push(item);
        }
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        this.cartItemsChanged.next();
    }

    /**
     * Updates the quantity of a cart item and saves the updated cart items to local storage.
     *
     * If the item does not exist, add it to the cart with the specified quantity.
     * @param item - The cart item to be updated.
     */
    setCartItem(item: CartItem): void {
        const existingItem = this.items.find(
            (existing) =>
                this.isEquals(existing, item)
        );
        if (existingItem) {
            existingItem.quantity = item.quantity;
            if (item.quantity <= 0) {
                this.removeCartItem(item);
            }
        } else {
            this.items.push(item);
        }
        localStorage.setItem('cartItems', JSON.stringify(this.items));
        this.cartItemsChanged.next();

    }


    /**
     * Removes a cart item from the cart.
     * 
     * Removes all items of that type, no matter the quantity.
     * This has the same effect as calling setCartItem and specifying a quantity of 0
     * 
     * @param item - The cart item to be removed.
     */
    removeCartItem(item: CartItem): void {
        this.items = this.items.filter(
            (existing) =>
                !this.isEquals(existing, item)
        );
        if (this.items.length == 0)
            localStorage.removeItem('cartItems');
        else
            localStorage.setItem('cartItems', JSON.stringify(this.items));
            this.cartItemsChanged.next();

    }

    /**
     * Removes all items from the shopping cart.
     */
    clearCart(): void {
        this.items = [];
        localStorage.removeItem('cartItems');
        this.cartItemsChanged.next();

    }

    /**
     * Retrieves all cart items.
     * @returns An array of cart items.
     */
    getAllCartItems(): CartItem[] {
        return this.items;
    }

    /**
     * Calculates and returns the total number of items in the cart.
     * 
     * Adds up all quantities of the same item.
     * @returns The total number of items in the cart.
     */
    getTotalCartItems(): number {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }
} 
