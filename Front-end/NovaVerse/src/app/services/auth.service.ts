import { Router } from '@angular/router';
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
  private authSubject = new BehaviorSubject<null | iUser>(null);  // Stato dell'utente autenticato
  private baseUrl = 'http://localhost:5034/api';  // URL del backend
  private userLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeUser();  // Inizializza l'utente dall'archiviazione locale
  }

  // Inizializzazione dell'utente al caricamento dell'applicazione
  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.authSubject.next(JSON.parse(storedUser));
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;
    }
  }

  // Registrazione di un nuovo utente
  register(newUser: Partial<iUser>): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, newUser).pipe(
      tap(() => {
        this.router.navigate(['/login']);  // Reindirizza alla pagina di login dopo la registrazione
      })
    );
  }

  // Effettua il login e aggiorna lo stato dell'utente
  login(authData: IAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(`${this.baseUrl}/auth/login`, authData, { withCredentials: true }).pipe(
      tap((res) => {
        const user = {
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
          password: res.user.password,
          role: res.user.role
        };
        this.authSubject.next(user);  // Aggiorna lo stato dell'utente
        localStorage.setItem('user', JSON.stringify(user));  // Salva l'utente in localStorage
        this.userLoggedIn = true;

        // Redirigi l'utente in base al suo ruolo
        if (res.user.role === 'Artist') {
          this.router.navigate(['/artist-dashboard']);
        } else if (res.user.role === 'Buyer') {
          this.router.navigate(['/buyer-dashboard']);
        }
      })
    );
  }

  // Effettua il logout e reimposta lo stato dell'utente
  logout(): void {
    this.authSubject.next(null);  // Resetta lo stato dell'utente
    this.userLoggedIn = false;
    localStorage.removeItem('user');  // Rimuovi l'utente dal localStorage

    // Effettua il logout dal backend
    this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe(() => {
      this.router.navigate(['/']);  // Reindirizza alla home dopo il logout
    });
  }

  // Controlla se l'utente è autenticato
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');  // Verifica la presenza dell'utente nel localStorage
  }

  // Restituisce l'utente corrente dal soggetto
  getCurrentUser(): iUser | null {
    return this.authSubject.value;
  }

  // Ripristina l'utente dal backend al caricamento della pagina
  restoreUser(): void {
    this.http.get<iUser>(`${this.baseUrl}/auth/currentUser`, { withCredentials: true }).subscribe(
      (user) => {
        this.authSubject.next(user);  // Aggiorna il soggetto con i dati dell'utente
        localStorage.setItem('user', JSON.stringify(user));  // Salva nuovamente nel localStorage
        this.userLoggedIn = true;
      },
      () => {
        this.authSubject.next(null);  // Se fallisce, imposta l'utente come non autenticato
        this.userLoggedIn = false;
        localStorage.removeItem('user');  // Rimuovi i dati utente se non è autenticato
      }
    );
  }
}
