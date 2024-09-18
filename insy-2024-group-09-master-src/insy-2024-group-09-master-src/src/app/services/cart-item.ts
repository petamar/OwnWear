/**
 * Represents an item in the cart.
 * 
 * id, color, and size make the item unique.
 */
export interface CartItem {
    // The id of the associated product.
    // Useful for querying additional information such as price
    readonly id: string;
    // Selected color id of the product in the cart
    readonly color: string;
    // Selected size of the product in the cart
    readonly size: string;
    quantity: number;
}