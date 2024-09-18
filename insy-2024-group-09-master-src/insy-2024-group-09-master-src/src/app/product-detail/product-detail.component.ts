import {Component, OnInit,  Output, EventEmitter} from '@angular/core';
import {ActivatedRoute, ParamMap} from "@angular/router";
import {NgForOf, NgStyle} from "@angular/common";
import {RouterModule} from '@angular/router';
import {ProductService} from "../services/product.service";
import {Product} from '../services/product';
import {NgFor, NgIf} from '@angular/common';
import {ProductItemComponent} from '../product-item/product-item.component';
import {ButtonModule} from 'primeng/button';
import {ButtonGroupModule} from 'primeng/buttongroup';
import {DataViewModule} from 'primeng/dataview';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ImageModule} from 'primeng/image';
import {CartService} from '../services/cart.service';
import {CartItem} from '../services/cart-item';
import {FormsModule} from '@angular/forms';


@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [NgFor, NgIf, ProductItemComponent, ButtonModule, ButtonGroupModule, DataViewModule,
        ProgressSpinnerModule, RouterModule, NgStyle, ImageModule, FormsModule],
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

    @Output() cartItemAdded = new EventEmitter<void>();

    product!: Product;
    selectedColor: any;
    selectedColorImage: string = '';
    selectedSize: string = '';
    cartMessageVisible: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private cartService: CartService
    ) {
    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((params: ParamMap) => {
            const productId = params.get('id');
            console.log(productId);
            if (productId) {
                this.productService.getProductMetadata(productId).subscribe(product => {
                    this.product = product;
                    this.selectColor(this.product.colors[0]); // start with first color
                    this.selectSize(this.product.sizes[0]);
                });
            }
        });
    }

    //select color and picture automatically with it
    selectColor(color: any): void {
        this.selectedColor = color;
        this.selectedColorImage = `./assets/products/images/${this.selectedColor.color_id}.jpg`;
    }

    selectSize(size: string): void {
        this.selectedSize = size;
    }

    addToCart(product: any): void {
        const cartItem: CartItem = {
            id: product.id,
            color: this.selectedColor.color_id,
            size: this.selectedSize,
            quantity: 1
        };
        this.cartService.addCartItem(cartItem);

        this.cartItemAdded.emit(); // Emit event when a new item is added


        this.cartMessageVisible = true;
        setTimeout(() => {
            this.cartMessageVisible = false;
        }, 3000);



    }
}
