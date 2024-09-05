import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { IAuthData } from '../Models/i-auth-data'; //  Definisci l'interfaccia di IAuthData con username, email, password, etc.
import { iAuthResponse } from '../Models/i-auth-response'; // Definisci la struttura della risposta del backend con l'utente e eventuali cookie
import { iUser } from '../Models/i-user'; // Interfaccia per gestire l'utente


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authSubject = new BehaviorSubject<null | iUser>(null);
  private baseUrl = 'http://localhost:5034/api';  // URL del backend

  private userLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Metodo per inizializzare l'utente quando l'app parte
  initializeUser(): void {
    this.restoreUser();
  }

  // Login

  login(authData: IAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(`${this.baseUrl}/auth/login`, authData);
  }


  // Registrazione
  register(newUser: Partial<iUser>): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, newUser);
  }


  // Logout
  logout(): void {
    this.authSubject.next(null);  // Resetta lo stato dell'utente
    this.userLoggedIn = false;  // Imposta l'utente come sloggato
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe();  // Logout lato backend
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
