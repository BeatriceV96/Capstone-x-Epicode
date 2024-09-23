import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Cart } from '../../Models/cart';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  cart$: Observable<Cart | null>;
  subtotal$: Observable<number>;
  totalCost$: Observable<number>;
  selectedPaymentMethod: string | null = null;

  // Definisci una variabile per la consegna
  deliveryCost: number = 4.00;

  constructor(private shoppingCartService: ShoppingCartService) {
    this.cart$ = this.shoppingCartService.cart$;

    // Calcola il subtotale (solo il costo degli articoli)
    this.subtotal$ = this.cart$.pipe(
      map(cart => cart ? cart.items.reduce((total, item) => total + item.priceAtAddTime * item.quantity, 0) : 0)
    );

    // Calcola il totale sommando il subtotale e il costo di consegna
    this.totalCost$ = this.subtotal$.pipe(
      map(subtotal => subtotal + this.deliveryCost)
    );
  }

  ngOnInit(): void {
    this.shoppingCartService.loadCart();
  }

  placeOrder(): void {
    // Logica per confermare l'ordine
    console.log("Ordine confermato");

    // Mostra un popup che conferma che l'ordine è stato effettuato
    alert('Ordine effettuato con successo!');
  }

  // Metodo per selezionare il pagamento
  selectPaymentMethod(method: string): void {
    this.selectedPaymentMethod = method;
  }
}

