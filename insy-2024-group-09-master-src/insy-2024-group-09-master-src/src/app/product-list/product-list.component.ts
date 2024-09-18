import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';
import { NgFor, NgIf } from '@angular/common';
import { ProductItemComponent } from '../product-item/product-item.component';
import { ButtonModule } from 'primeng/button';
import { ButtonGroupModule } from 'primeng/buttongroup';
import { DataViewModule } from 'primeng/dataview';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { RouterModule } from '@angular/router';
import { DataView } from 'primeng/dataview';
import { SidebarModule } from 'primeng/sidebar';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { InputGroupModule } from 'primeng/inputgroup';
import { FormsModule, NgModel } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart-item';
import { Color } from "../services/color";


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  standalone: true,
  imports: [NgFor, NgIf, ProductItemComponent, ButtonModule, ButtonGroupModule, DataViewModule,
    ProgressSpinnerModule,FormsModule, RouterModule, SidebarModule,InputTextModule,
    CheckboxModule, InputGroupModule, DropdownModule]
})

export class ProductListComponent implements OnInit {
  brands: string[] = [];
  sizes: string[] = [];
  colors: string[] = [];
  brandsFiltered: string[] = [];
  sizesFiltered: string[] = [];
  colorsFiltered: string[] = [];
  products: Product[] = [];
  loading: boolean = false;
  noMoreProducts: boolean = false; // Define the flag here
  showProducts: boolean = true;
  sidebarVisible = false;
  searchBar: string = "";
  selectedColor: any;
  selectedColorImage: string = '';
  selectedSize: string = '';
  cartMessageVisible: boolean = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}


  ngOnInit(): void {
      this.productService.getBrandList().subscribe((brands) => {
        this.brands = brands;
    });

    this.productService.getSizesList().subscribe((sizes) => {
        this.sizes = sizes;
    });

    this.productService.getColorsList().subscribe((colors) => {
        this.colors = colors.map((color) => color.color_name);
    });

    this.loadInitialProducts();
  }

  onFiltersChanged(filters: any): void {
    this.showProducts = false;
    this.loading = true;
    this.noMoreProducts = false; // flag to see when there is no more products
    this.products = [];
    this.productService.getInitialProductMetadata(10, filters.searchBar, undefined, filters.brands, undefined, undefined, undefined, filters.colors, filters.sizes)
      .subscribe(
        (filteredProducts) => {
          this.products = filteredProducts;
          this.loading = false;
        },
        (error) => {
          console.error('Error loading filtered products:', error);
          this.loading = false;
        }
      );
      this.loadInitialProducts();
      console.log("this are initial filtered");
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const distanceToBottom = document.body.scrollHeight - (window.innerHeight + window.scrollY);

    const threshold = 200;

    if (distanceToBottom < threshold && !this.loading && !this.noMoreProducts) {
      this.loadMoreProducts();
    }
  }

  loadInitialProducts() {
    this.loading = true;
    const numItems = 10;
    this.productService.getInitialProductMetadata(numItems).subscribe(
      (initialProducts) => {
        this.products = this.products.concat(initialProducts);
        this.loading = false;

      },
      (error) => {
        console.error('Error loading initial products:', error);
      }
    );
  }

  loadMoreProducts() {
    if (this.loading || this.noMoreProducts) {
      return; // If already loading or no more products, prevent duplicate requests
    }
    this.loading = true;
    const numItems = 10;
    this.productService.getNextProductMetadata(numItems).subscribe(
      (additionalProducts) => {
        this.products = this.products.concat(additionalProducts);
        this.loading = false;
      },
      (error) => {
        if (error.message === 'No more products to load') {
          //message when there is no more products to load
          //can be writen here instead of html
          this.noMoreProducts = true;
          const noMoreProductsMessage = document.createElement('div');
          noMoreProductsMessage.innerText = '';
          noMoreProductsMessage.style.textAlign = 'center';
          noMoreProductsMessage.style.marginTop = '20px';
          document.body.appendChild(noMoreProductsMessage);
        } else {
          console.error('Error loading more products:', error);
        }
        this.loading = false;
      }
    );
  }

  onFilter(){
    this.products = [];
    console.log("on filter is called ");
    this.productService.getInitialProductMetadata(
      9,
      undefined, //filter
      this.searchBar, //search
      this.brandsFiltered, //puma
      undefined,
      undefined,
      undefined,
      this.colorsFiltered, //colour
      this.sizesFiltered, //sizes
    ).subscribe((values) =>{
      this.products = values;
    },
    (error) => {
      console.error('Error loading filtered products:', error);
    });
  }

    addToCart(product: any, thisSize: any, thisColor: string): void {
    console.log("random color" + product.colors[0]);

    const cartItem: CartItem = {
      id: product.id,
      color: thisColor,
      size: thisSize,
      quantity: 1
    };
    this.cartService.addCartItem(cartItem);

      this.cartMessageVisible = true;
      setTimeout(() => {
          this.cartMessageVisible = false;
      }, 3000);
  }

  getRandomColorName(itemId: string): string {
    const product = this.products.find(item => item.id === itemId);
    if (product && product.colors && product.colors.length > 0) {
      // Get a random color index
      const randomIndex = Math.floor(Math.random() * product.colors.length);
      // Get the color at the random index
      const randomColor = product.colors[randomIndex];
      // Return the color name
      return randomColor.color_id;
    } else {
      return 'No Color';
    }
  }

}

