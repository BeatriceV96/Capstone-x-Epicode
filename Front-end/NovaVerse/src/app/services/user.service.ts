import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iUser } from '../Models/i-user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private baseUrl = 'http://localhost:5034/api/userdashboard';

  constructor(private http: HttpClient) { }

  // Ottiene il profilo utente dal backend
  getUserProfile(): Observable<iUser> {
    return this.http.get<iUser>(`${this.baseUrl}/profile`);
  }

  // Aggiorna il profilo utente
  updateUserProfile(updatedUser: iUser): Observable<iUser> {
    return this.http.put<iUser>(`${this.baseUrl}/update-profile`, updatedUser);
  }
}
