import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private baseUrl = 'http://localhost:5034/api/favorite';

  constructor(private http: HttpClient) {}

  addFavorite(favoriteDto: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, favoriteDto);
  }

  removeFavorite(favoriteId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/remove/${favoriteId}`);
  }
}
