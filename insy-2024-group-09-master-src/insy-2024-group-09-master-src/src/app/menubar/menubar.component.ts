    import {Component, OnInit} from '@angular/core';
    import {ButtonModule} from 'primeng/button';
    import {Router, RouterModule} from '@angular/router';
    import {CommonModule} from '@angular/common';
    import { BadgeModule } from 'primeng/badge';
    import { CartService } from '../services/cart.service';
    import { Subscription } from 'rxjs';


    @Component({
        selector: 'app-menubar',
        standalone: true,
        imports: [CommonModule, ButtonModule, RouterModule, BadgeModule],
        templateUrl: './menubar.component.html',
        styleUrl: './menubar.component.css',
    })
    export class MenubarComponent implements OnInit {

        totalCartItems: number = 0;
        private cartSubscription!: Subscription;
        constructor(private router: Router, 
            private cartService: CartService) {}


        ngOnInit(): void {
            this.updateTotalCartItems();
            this.cartSubscription = this.cartService.cartItemsChanged.subscribe(() => {
                this.updateTotalCartItems();
            });
        }

        updateTotalCartItems(): void {
            this.totalCartItems = this.cartService.getTotalCartItems();

        }
       
    }