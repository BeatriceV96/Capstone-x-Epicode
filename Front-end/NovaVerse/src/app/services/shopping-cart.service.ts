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
        if (cart && cart.items && (cart.items as any).$values) {
          cart.items = (cart.items as any).$values;
        }
        this.cartSubject.next(cart); // Aggiorna il BehaviorSubject
      }),
      catchError(this.handleError)
    ).subscribe();
  }

  // Aggiungi un elemento al carrello o incrementa la quantità se esiste
  addItemToCart(newItem: CartItem): Observable<any> {
    const currentCart = this.cartSubject.value;

    if (currentCart) {
      const existingItem = currentCart.items.find(item => item.artworkId === newItem.artworkId);

      if (existingItem) {
        existingItem.quantity += newItem.quantity;
      } else {
        currentCart.items.push(newItem);
      }

      this.cartSubject.next(currentCart); // Aggiorna il BehaviorSubject
    }

    return this.http.post(`${this.baseUrl}/add`, newItem, { withCredentials: true }).pipe(
      tap(() => this.loadCart()),
      catchError(this.handleError)
    );
  }

  // Incrementa la quantità di un articolo
  increaseQuantity(item: CartItem): void {
    const currentCart = this.cartSubject.value;

    if (currentCart) {
      const foundItem = currentCart.items.find(cartItem => cartItem.artworkId === item.artworkId);
      if (foundItem) {
        foundItem.quantity++;
        this.cartSubject.next(currentCart); // Aggiorna il BehaviorSubject
      }
    }
  }

  // Decrementa la quantità di un articolo
  decreaseQuantity(item: CartItem): void {
    const currentCart = this.cartSubject.value;

    if (currentCart) {
      const foundItem = currentCart.items.find(cartItem => cartItem.artworkId === item.artworkId);
      if (foundItem && foundItem.quantity > 1) {
        foundItem.quantity--;
        this.cartSubject.next(currentCart); // Aggiorna il BehaviorSubject
      }
    }
  }

  removeItemFromCart(item: CartItem): void {
    let currentCart = this.cartSubject.value;

    if (currentCart) {
      const index = currentCart.items.findIndex(cartItem => cartItem.artworkId === item.artworkId);
      const newCart = currentCart.items.splice(index, 1);
        this.cartSubject.next(currentCart); // Aggiorna il BehaviorSubject
      }
    }

  // Rimuovi un elemento dal carrello
  // removeItemFromCart(itemId: number): Observable<any> {
  //   return this.http.delete<any>(`${this.baseUrl}/remove/${itemId}`, { withCredentials: true }).pipe(
  //     catchError(this.handleError)
  //   );
  // }


  checkout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/checkout`,  { withCredentials: true }).pipe(
      tap(() => this.clearCart()),
      catchError(this.handleError)
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
      errorMessage = `Errore: ${error.error.message}`;
    } else {
      errorMessage = `Errore del server: ${error.status}\nMessaggio: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
