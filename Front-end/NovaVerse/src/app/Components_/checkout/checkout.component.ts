import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Cart } from '../../Models/cart';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var Stripe: any;  // Aggiungi Stripe come variabile globale

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart | null>;
  totalCost$: Observable<number>;

  constructor(private shoppingCartService: ShoppingCartService) {
    this.cart$ = this.shoppingCartService.cart$;
    this.totalCost$ = this.cart$.pipe(
      map(cart => cart ? cart.items.reduce((total, item) => total + item.priceAtAddTime * item.quantity, 0) : 0)
    );
  }

  ngOnInit(): void {
    this.shoppingCartService.loadCart();
  }

  // Inizializza il pagamento con Stripe
  payWithStripe(): void {
    this.totalCost$.subscribe(totalCost => {
      const stripe = Stripe('tuo-pubblico-key-di-stripe');  // Chiave pubblica di Stripe

      stripe.redirectToCheckout({
        lineItems: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Acquisto opere d\'arte',
              },
              unit_amount: totalCost * 100,  // Converti in centesimi
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        successUrl: 'http://localhost:4200/success',
        cancelUrl: 'http://localhost:4200/cancel',
      }).then((result: any) => {
        if (result.error) {
          console.error('Errore durante il pagamento con Stripe:', result.error.message);
        }
      });
    });
  }
}
