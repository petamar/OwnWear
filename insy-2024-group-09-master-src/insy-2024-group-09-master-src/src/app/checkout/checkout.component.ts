import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { StepperModule } from 'primeng/stepper';
import {FormsModule, ReactiveFormsModule} from '@angular/forms'; // Import FormsModule
import { CommonModule, NgIf} from '@angular/common';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { CartService } from '../services/cart.service';
import { CartItem } from '../services/cart-item';
import { ProductService } from '../services/product.service';
import { Product } from '../services/product';



@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [ButtonModule, RouterModule, StepperModule, FormsModule, NgIf, CommonModule, ReactiveFormsModule], // Add FormsModule
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'], // Correct spelling: styleUrls
})
export class CheckoutComponent {
    addressForm: FormGroup;
    showErrorMessage = false;
    selectedDelivery: string = '';
    selectedPayment: string = '';
    errorMessage: string = '';
    subtotal: number = 0;
    total: number = 5;
    cartItems: CartItem[] = [];
    product?: Product;
    productData: { [itemId: string]: Product } = {};
    today: Date = new Date();
    DHLDate: Date;
    UPSDate: Date;
    germanPost: Date;

    constructor(private fb: FormBuilder,  
        private productService: ProductService,
        private cartService: CartService,

    ) {
        this.germanPost = this.today;  // Assign `this.germanPost` to `this.today`
        this.DHLDate = new Date(this.today.setDate(this.today.getDate() + 4));
        this.UPSDate = new Date(this.today.setDate(this.today.getDate() + 7));
        console.log(this.today);

        this.addressForm = this.fb.group({
            firstName: ['Axel', Validators.required],
            lastName: ['Haar', Validators.required],
            streetName: ['Wilmaruhestraße', Validators.required],
            streetNumber: ['12', Validators.required],
            postalCode: ['78464', Validators.required],
            city: ['Konstanz', Validators.required],
            country: ['Germany', Validators.required]
          });
    }

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
        this.total = parseFloat((this.subtotal).toFixed(2)); //toFixed sets number to have 2 decmals
        console.log("Total:", this.total);
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
    

    validateAndProceed(nextCallback: any) {
        if (!this.selectedDelivery || !this.selectedPayment) {
            this.errorMessage = 'Please choose one delivery option and one payment option.';
        } else {
            this.errorMessage = '';
            nextCallback.emit();
        }
    }

    handleNextClick(nextCallback: any) {
        if (this.addressForm.valid) {
            this.showErrorMessage = false;
            nextCallback.emit();
        } else {
            this.showErrorMessage = true;
        }
    }

    getDeliveryPrice(): number{
        if(this.selectedDelivery == "DHL"){
            return 4.99
        }
        if(this.selectedDelivery == "German Post"){
            return 11.99
        }if(this.selectedDelivery == "UPS"){
            return 2.99
        }else{
            return 0;

        }
    }

    getDeliveryDate(): any {
        let date: Date;
        if (this.selectedDelivery == "DHL") {
          date = this.DHLDate;
          console.log("DHLLLLLLLLLLL");

        console.log(date);
        } else if (this.selectedDelivery == "German Post") {
          date = this.germanPost;
          console.log("GERMANNNN");
          console.log(date);

        } else if (this.selectedDelivery == "UPS") {
          date = this.UPSDate;
          console.log("UPSSSSSSSss");

          console.log(date);

        } else {
          return 0;
        }
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short',year: "numeric" });
      }


}
