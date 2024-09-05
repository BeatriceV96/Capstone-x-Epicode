import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAuthData } from '../Models/i-auth-data';
import { iAuthResponse } from '../Models/i-auth-response';
import { iUser } from '../Models/i-user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<null | iUser>(null);
  private baseUrl = 'http://localhost:5034/api';  // URL del backend
  private userLoggedIn = false;

  constructor(private http: HttpClient) {}

  // Metodo per inizializzare l'utente quando l'app parte
  initializeUser(): void {
    this.restoreUser();
  }

  // Login
  login(authData: IAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(`${this.baseUrl}/auth/login`, authData).pipe(
      tap((res) => {
        this.authSubject.next(res.user);  // Memorizza l'utente nel BehaviorSubject
        this.userLoggedIn = true;  // Imposta lo stato dell'utente come loggato
      })
    );
  }

  // Registrazione
  register(newUser: Partial<iUser>): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, newUser);
  }

  // Logout
  logout(): void {
    this.authSubject.next(null);  // Resetta lo stato dell'utente
    this.userLoggedIn = false;  // Imposta l'utente come sloggato
    // Se necessario, puoi anche fare una chiamata al backend per gestire il logout
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe();
  }

  // Controlla se l'utente è loggato
  isAuthenticated(): boolean {
    return this.userLoggedIn;
  }

  // Restituisce l'utente corrente
  getCurrentUser(): iUser | null {
    return this.authSubject.value;
  }

  // Metodo per ripristinare l'utente (da completare in base al tuo backend)
  private restoreUser(): void {
    this.http.get<iUser>(`${this.baseUrl}/auth/currentUser`).subscribe(
      (user) => {
        this.authSubject.next(user);
        this.userLoggedIn = true;
      },
      () => {
        this.authSubject.next(null);
        this.userLoggedIn = false;
      }
    );
  }
}

