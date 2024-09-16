import { Component, ElementRef, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Cart, CartItem } from '../../Models/cart';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: Cart | null = null; // Memorizza i dati del carrello
  totalCost: number = 0; // Totale del carrello
  loading: boolean = true; // Stato di caricamento
  errorMessage: string | null = null; // Messaggi di errore


  constructor(private shoppingCartService: ShoppingCartService) {}

  ngOnInit(): void {
    // Sottoscrizione all'Observable del carrello
    this.shoppingCartService.cart$.subscribe((cart) => {
      console.log('Carrello caricato:', cart);
      this.loading = false;

      if (cart && cart.items) {
        this.cart = cart;
        this.calculateTotalCost(); // Calcola il costo totale
      } else {
        this.totalCost = 0;
      }
    });

    // Carica il carrello
    this.shoppingCartService.loadCart();
  }

  // Calcola il costo totale del carrello
  calculateTotalCost(): void {
    this.totalCost = (this.cart?.items.reduce(
      (total, item) => total + item.priceAtAddTime * item.quantity,
      0
    )) || 0;
  }

  // Diminuisci la quantità di un articolo
  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.calculateTotalCost();
    }
  }

  // Aumenta la quantità di un articolo
  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.calculateTotalCost();
  }

  // Rimuovi un elemento dal carrello
  removeItem(itemId: number): void {
    this.shoppingCartService.removeItemFromCart(itemId).subscribe(() => {
      if (this.cart) {
        this.cart.items = this.cart.items.filter((item) => item.id !== itemId);
        this.calculateTotalCost();
      }
    });
  }

  // Effettua il checkout
  checkout(): void {
    this.shoppingCartService.checkout().subscribe(() => {
      console.log('Checkout completato con successo');
      this.cart = null; // Svuota il carrello dopo il checkout
    });
  }
}
