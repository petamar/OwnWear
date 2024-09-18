/**
 * Represents a color variant of a product.
 * 
 * The names are prefixed with `color_` to remain compatible with older versions
 */
export interface Color {
    // The color ID is simultaneously the filename of the image showing the product in that color variant.
    color_id: string;
    // The name of the color
    color_name: string;
    // The hex code that corresponds to the name of the color
    color_hex: string;
}