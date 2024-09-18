import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';


@Component({
  selector: 'app-success',
  standalone: true,
  imports: [],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  constructor(    private cartService: CartService
  ){}

  ngOnInit() {
    this.cartService.clearCart();
  }

}


