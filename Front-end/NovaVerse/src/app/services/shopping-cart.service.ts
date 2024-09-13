import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private baseUrl = 'http://localhost:5034/api/shoppingCart';

  constructor(private http: HttpClient) {}

  addItemToCart(cartItem: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, cartItem);
  }

  removeItemFromCart(itemId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${itemId}`);
  }

  checkout(): Observable<any> {
    return this.http.post(`${this.baseUrl}/checkout`, {});
  }
}
