import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import {CartComponent} from "./cart/cart.component";
import { CheckoutComponent } from './checkout/checkout.component';
import { SuccessComponent } from './success/success.component';


export const routes: Routes = [
    {
        path: 'login',
        component: LoginComponent,
    },
    {
        path: 'register',
        component: RegisterComponent,

    },
    {
        path: '',
        component: ProductListComponent,

    },
    {
        path: 'product/:id',
        component: ProductDetailComponent,

    },
    {
        path: 'cart',
        component: CartComponent,

    },
    {
        path: 'checkout',
        component: CheckoutComponent,

    },
    {
        path: 'success',
        component: SuccessComponent,

    },
    { path: '**', redirectTo: '' }

];


