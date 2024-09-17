import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, CartItem } from '../Models/cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private baseUrl = 'http://localhost:5034/api/shoppingCart';
  private cartSubject = new BehaviorSubject<Cart | null>(null); // BehaviorSubject per il carrello
  cart$: Observable<Cart | null> = this.cartSubject.asObservable(); // Observable per il carrello

  constructor(private http: HttpClient) {}

  // Metodo per caricare il carrello
  loadCart(): void {
    this.http.get<Cart>(`${this.baseUrl}`, { withCredentials: true }).pipe(
      tap((cart: Cart) => {
        // Se il server restituisce una proprietà $values, la gestiamo
        if (cart && cart.items && (cart.items as any).$values) {
          cart.items = (cart.items as any).$values; // Converte $values in un array normale
        }
        this.cartSubject.next(cart); // Aggiorna il BehaviorSubject
      }),
      catchError(this.handleError)
    ).subscribe(); // Esegui la richiesta e aggiorna il BehaviorSubject
  }

  // Aggiungi un elemento al carrello
  // Metodo per aggiungere un elemento al carrello
addItemToCart(cartItem: CartItem): Observable<any> {
  return this.http.post(`${this.baseUrl}/add`, cartItem, { withCredentials: true }).pipe(
    tap(() => {
      this.loadCart(); // Ricarica il carrello dopo l'aggiunta
    }),
    catchError(this.handleError)
  );
}

removeItemFromCart(itemId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/remove/${itemId}`, { withCredentials: true });
}


updateCart(cart$: Observable<Cart | null>): void {
  // Emette il nuovo stato del carrello
  cart$.subscribe(cart => {
    if (cart) {
      this.cartSubject.next(cart);
    }
  });
}

  // Checkout
  checkout(): Observable<void> {
    return this.http.post<void>('http://localhost:5034/api/shoppingCart/checkout', {}).pipe(
      tap(() => this.clearCart())
    );
  }


  // Svuota il carrello
  clearCart(): void {
    this.cartSubject.next({ items: [] } as unknown as Cart); // Svuota il carrello
  }

   // Metodo per gestire gli errori
   private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Errore sconosciuto';
    if (error.error instanceof ErrorEvent) {
      // Errore lato client
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      // Errore lato server
      errorMessage = `Errore del server: ${error.status}\nMessaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}




