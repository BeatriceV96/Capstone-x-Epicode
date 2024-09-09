import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iUser } from '../Models/i-user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:5034/api/user-dashboard';  // Aggiorna l'URL se necessario

  constructor(private http: HttpClient) {}

  // Metodo per aggiornare il profilo dell'utente
  updateUserProfile(user: iUser): Observable<iUser> {
    return this.http.put<iUser>(`${this.baseUrl}/update-profile`, user);
  }
}
