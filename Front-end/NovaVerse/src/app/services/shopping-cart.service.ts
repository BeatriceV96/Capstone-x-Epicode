import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Cart, CartItem } from '../Models/cart';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private baseUrl = 'http://localhost:5034/api/shoppingCart';
  private cartSubject = new BehaviorSubject<Cart | null>(null); // BehaviorSubject per il carrello
  public cart$ = this.cartSubject.asObservable(); // Observable per il carrello

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


  // Rimuovi un elemento dal carrello
  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${itemId}`).pipe(
      tap(() => {
        this.loadCart(); // Ricarica il carrello dopo la rimozione
      }),
      catchError(this.handleError)
    );
  }

  // Effettua il checkout
  checkout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, {}).pipe(
      tap(() => {
        this.cartSubject.next(null); // Svuota il carrello dopo il checkout
      }),
      catchError(this.handleError)
    );
  }

  // Gestione degli errori
  private handleError(error: any): Observable<never> {
    console.error('Errore nel servizio ShoppingCartService:', error);
    return throwError(error);
  }
}
