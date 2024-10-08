import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { Cart, CartItem } from '../../Models/cart';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { map, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('in', style({ opacity: 1, transform: 'scale(1)' })),
      state('out', style({ opacity: 0, transform: 'scale(0)' })),
      transition('in => out', [
        animate('0.5s ease-out')
      ]),
      transition('out => in', [
        animate('0.5s ease-in')
      ])
    ])
  ],
})

export class CartComponent implements OnInit {
  cart$: Observable<Cart | null>; // Observable per il carrello
  totalCost$: Observable<number>; // Observable per il totale in tempo reale

  constructor(private shoppingCartService:
    ShoppingCartService,
    private router: Router,
  ) {
    // Inizializziamo gli Observable
    this.cart$ = this.shoppingCartService.cart$;
    this.totalCost$ = this.cart$.pipe(
      map(cart => cart ? cart.items.reduce((total, item) => total + item.priceAtAddTime * item.quantity, 0) : 0)
    );
  }

  ngOnInit(): void {
    this.shoppingCartService.loadCart();
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
    this.shoppingCartService.updateCartItemQuantity(item).subscribe(
      () => {
        this.shoppingCartService.loadCart();  // Ricarica il carrello per aggiornare il totale
      },
      (error) => console.error('Errore durante l\'aggiornamento della quantità:', error)
    );
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity > 1) {
      item.quantity--;
      this.shoppingCartService.updateCartItemQuantity(item).subscribe(
        () => {
          this.shoppingCartService.loadCart();  // Ricarica il carrello per aggiornare il totale
        },
        (error) => console.error('Errore durante l\'aggiornamento della quantità:', error)
      );
    }
  }

  removeItem(item: CartItem): void {
    this.shoppingCartService.removeItemFromCart(item).subscribe(
      () => {
        console.log('Articolo rimosso dal carrello');
        this.shoppingCartService.loadCart();  // Ricarica il carrello dopo la rimozione
      },
      (error) => console.error('Errore durante la rimozione dell\'articolo dal carrello:', error)
    );
  }


  // Rimuovi un elemento dal carrello con animazione
  // removeItem(itemId: number, index: number): void {
  //   this.cart$.subscribe(cart => {
  //     if (cart) {
  //       cart.items[index].removing = true; // Attiva l'animazione di rimozione
  //       setTimeout(() => {
  //         this.shoppingCartService.removeItemFromCart(itemId).subscribe();
  //       }, 500); // Delay per l'animazione
  //     }
  //   });
  // }

  // Effettua il checkout
  checkout(): void {
    this.shoppingCartService.checkout().subscribe(() => {
      console.log('Checkout completato con successo');
      this.router.navigate(['/checkout']); // Naviga alla pagina di checkout
    });
  }

  goToArtworkDetail(artworkId: number | undefined): void {
    if (artworkId) {
      this.router.navigate(['/artworks', artworkId]);
    } else {
      console.error('ID dell\'opera non valido.');
    }
  }
}
