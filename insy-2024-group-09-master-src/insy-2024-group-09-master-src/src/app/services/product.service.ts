import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from './product';
import { Observable, map } from 'rxjs';
import { Color } from './color';

@Injectable({
    providedIn: 'root',
})

// Provides product metadata to the application.
export class ProductService {
    productMetadata: Observable<Product[]>;
    // Stores all products with filter applied
    filteredProductMetadata: Observable<Product[]>;

    nextIndex: number = 0;

    constructor(private http: HttpClient) {
        // For simplicity, we load all product metadata when the application starts
        this.productMetadata = this.http.get<Product[]>(
            'assets/products/metadata.json'
        );
        this.filteredProductMetadata = this.productMetadata;
    }

    // Returns metadata of all products. For structure, see assets/products/metadata.json file.
    // This does not return the actual JSON, but an Observable.
    // Learn more about working with Observables at https://rxjs.dev/guide/overview
    getAllProductMetadata() {
        return this.productMetadata;
    }

    /**
     * Returns a `numItems` number of products.
     * Optionally passes a filter to limit what products are selected.
     *
     * `filter` specifies a predicate function evaluated for each product.
     * If `true`, that product is included in the dataset.
     *
     * `searchText` specifies a search string that must be included in the
     * product name (case insensitive).
     *
     * ...Filtered arrays specify features of that metadata category to include
     * in the dataset. These are disjuncitve *inside* categories, meaning e.g. inclusion of
     * 'Shirts' and 'Sandals' in `typesFiltered` returns a dataset that includes *both*
     * shirts and sandals.
     * However, they are conjunctive *across* categories, meaning that e.g. inclusion of
     * 'Shirts' in `typesFiltered` and 'Red' in `colorsFiltered` returns a dataset that includes
     * products that are both shirts and are available in red.
     *
     * If this predefined filter logic is not sufficient for your needs, you can provide custom
     * logic through the `filter` predicate. This is always evaluated, even if the ...Filtered
     * arrays are specified.
     * 
     * When retrieving more items later with getNextProductMetadata those products match the last
     * filter and search criteria passed to this method.
     *
     *
     * @param numItems - The number of items to retrieve.
     * @param filter - An optional filter function to apply to each product.
     * @param searchText - An optional search text to filter products by.
     * @param brandsFiltered - An optional array of brand names to filter products by.
     * @param gendersFiltered - An optional array of genders to filter products by.
     * @param typesFiltered - An optional array of types to filter products by.
     * @param categoriesFiltered - An optional array of categories to filter products by.
     * @param colorsFiltered - An optional array of colors to filter products by.
     * @param sizesFiltered - An optional array of sizes to filter products by.
     * @returns An Observable that emits an array of `numItems` products.
     */
    getInitialProductMetadata(
        numItems: number,
        filter?: (product: Product) => boolean,
        searchText?: string,
        brandsFiltered?: string[],
        gendersFiltered?: string[],
        typesFiltered?: string[],
        categoriesFiltered?: string[],
        colorsFiltered?: string[],
        sizesFiltered?: string[]
    ) {
        // Initialize optional arguments with empty arrays if not provided
        searchText ||= '';
        brandsFiltered ||= [];
        gendersFiltered ||= [];
        typesFiltered ||= [];
        categoriesFiltered ||= [];
        colorsFiltered ||= [];
        sizesFiltered ||= [];
        return new Observable<Product[]>((subscriber) => {
            this.productMetadata.subscribe(() => {
                this.filteredProductMetadata = this.productMetadata.pipe(
                    map((allProducts) =>
                        allProducts.filter((product) => {
                            // Intialize with empty values if not provided.
                            // Empty values behave like no filter/search term
                            searchText ||= '';
                            brandsFiltered ||= [];
                            gendersFiltered ||= [];
                            typesFiltered ||= [];
                            categoriesFiltered ||= [];
                            colorsFiltered ||= [];
                            sizesFiltered ||= [];
                            return (
                                this.filterProduct(
                                    product,
                                    searchText,
                                    brandsFiltered,
                                    gendersFiltered,
                                    typesFiltered,
                                    categoriesFiltered,
                                    colorsFiltered,
                                    sizesFiltered
                                ) &&
                                (!filter || filter(product))
                            );
                        })
                    )
                );
                this.filteredProductMetadata.subscribe((allProducts) => {
                    subscriber.next(allProducts.slice(0, numItems));
                    this.nextIndex = numItems;
                    subscriber.complete();
                });
            });
        });
    }

    private filterProduct(
        product: Product,
        searchText: string,
        brandsFiltered: string[],
        gendersFiltered: string[],
        typesFiltered: string[],
        categoriesFiltered: string[],
        colorsFiltered: string[],
        sizesFiltered: string[]
    ): boolean {
        // Also evaluate search, as the filter can refine search results
        if (
            !product.name
                .toLowerCase()
                .includes(searchText.toLowerCase().trim())
        )
            return false;
        if (
            !brandsFiltered.includes(product.brand) &&
            brandsFiltered.length > 0
        )
            return false;
        if (
            !gendersFiltered.includes(product.gender) &&
            gendersFiltered.length > 0
        )
            return false;
        if (!typesFiltered.includes(product.type) && typesFiltered.length > 0)
            return false;
        if (
            !categoriesFiltered.includes(product.category) &&
            categoriesFiltered.length > 0
        )
            return false;
        if (
            !colorsFiltered.some((name) =>
                product.colors
                    .flat()
                    .map((color) => color.color_name)
                    .includes(name)
            ) &&
            colorsFiltered.length > 0
        )
            return false;
        if (
            !sizesFiltered.some((size) =>
                product.sizes.flat().includes(size)
            ) &&
            sizesFiltered.length > 0
        )
            return false;
        return true;
    }

    
    /**
     * Returns next numItems number of products. Only returns the new products,
     * the frontend is responsible for storing already obtained products.
     * If a filter was set in getInitialProductMetadata, items returned in this method
     * match the filter criterion.
     * 
     * @param numItems The number of items to retrieve.
     * @returns An Observable that emits an array of Product elements.
     * @throws An error if getInitialProductMetadata was not called before this.
     */
    getNextProductMetadata(numItems: number) {
        return new Observable<Product[]>((subscriber) => {
            console.log("next index is " + this.nextIndex);
    
            if (this.nextIndex == 0) {
                subscriber.error(
                    new Error(
                        'Tried to fetch more products without initialization. Run getInitialProductMetadata to obtain the first set of items.'
                    )
                );
            }
    
            this.filteredProductMetadata.subscribe((allProducts) => {
                console.log("is filtering");
    
                // Add artificial delay
                setTimeout(() => {
                    if (allProducts.length == 0 || this.nextIndex >= allProducts.length) {
                        console.log("NO MORE");
     
                    // Send an error to indicate no more products
                    subscriber.error(new Error('No more products to load'));
                    subscriber.complete(); 
                    return; 
                    }
    
                    subscriber.next(
                        allProducts.slice(
                            this.nextIndex,
                            this.nextIndex + numItems
                        )
                    );
                    this.nextIndex += numItems;
                    subscriber.complete();
                }, 700);
            });
    
            console.log(this.filteredProductMetadata);
        });
    }
    

    // Get the product metadata for a single product by its id. Also returns an Observable.
    getProductMetadata(id: string) {
        return new Observable<Product>((subscriber) => {
            this.productMetadata?.subscribe((products) => {
                let product = products.find((product) => {
                    return product.id == id;
                });
                if (product === undefined) {
                    subscriber.error(
                        new Error(
                            `Product with ID ${id} does not exist in dataset`
                        )
                    );
                } else {
                    subscriber.next(product);
                    subscriber.complete();
                }
            });
        });
    }

    getBrandList(): Observable<string[]> {
        return this.getMetadataList<string>('brand');
    }

    getGenderList(): Observable<string[]> {
        return this.getMetadataList<string>('gender');
    }

    getTypeList(): Observable<string[]> {
        return this.getMetadataList<string>('type');
    }

    /**
     * Retrieves a list of unique colors from the product metadata.
     * 
     * If one product has multiple color variants, all are added.
     * 
     * @returns An Observable that emits an array of Color objects.
     */
    getColorsList(): Observable<Color[]> {
        return new Observable<Color[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    allProducts
                        // Get color variants
                        .map((product) => product['colors'])
                        // Dissolve colors into single array
                        .flat()
                        // Deduplicate if color names are equal (name is the same)
                        .filter(
                            (color, index, self) =>
                                self.findIndex(
                                    (c) => c.color_name === color.color_name
                                ) === index
                        )
                        .sort()
                );
                subscriber.complete();
            });
        });
    }

    getCategoryList(): Observable<string[]> {
        return this.getMetadataList<string>('category');
    }

    getPriceList(): Observable<string[]> {
        return this.getMetadataList<string>('price');
    }

    /**
     * Retrieves a list of unique sizes from the product metadata.
     * 
     * If one product has multiple sizes, all are added.
     * 
     * @returns An Observable that emits an array of strings representing the sizes.
     */
    getSizesList(): Observable<string[]> {
        return new Observable<string[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    allProducts
                        .map((product) => product['sizes'])
                        // Dissolve sizes into single array
                        .flat()
                        // Deduplicate if size names are equal
                        .filter(
                            (size, index, self) =>
                                self.findIndex((s) => s === size) === index
                        )
                        .sort()
                );
                subscriber.complete();
            });
        });
    }

    private getMetadataList<T>(field: string): Observable<T[]> {
        return new Observable<T[]>((subscriber) => {
            this.productMetadata.subscribe((allProducts) => {
                subscriber.next(
                    [
                        ...new Set(
                            allProducts.map((product) => product[field])
                        ),
                    ].sort()
                );
                subscriber.complete();
            });
        });
    }

    getProductImage(id: string) {
        return `./assets/products/images/${id}.jpg`;
    }

    
}
