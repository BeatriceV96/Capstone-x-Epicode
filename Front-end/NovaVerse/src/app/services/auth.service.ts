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
  private authSubject = new BehaviorSubject<null | iUser>(null);
  private baseUrl = 'http://localhost:5034/api';  // URL del backend
  private userLoggedIn = false;

  constructor(private http: HttpClient, private router: Router) {
    this.initializeUser();
  }

  // Metodo per inizializzare l'utente quando l'app parte
  initializeUser(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.authSubject.next(JSON.parse(storedUser));
      this.userLoggedIn = true;
    } else {
      this.userLoggedIn = false;  // Se non c'è nessun utente in localStorage, lo stato è sloggato
    }
  }

  register(newUser: Partial<iUser>): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, newUser);
  }

  // Login
  login(authData: IAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(`${this.baseUrl}/auth/login`, authData).pipe(
      tap((res) => {
        const user = {
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
          password: "",  // Non salviamo la password qui
          role: res.user.role
        };
        // Salva l'utente sia in authSubject che in localStorage
        this.authSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.userLoggedIn = true;

        // Redirigi l'utente in base al ruolo
        if (res.user.role === 'Artist') {
          this.router.navigate(['/artist-dashboard']);
        } else if (res.user.role === 'Buyer') {
          this.router.navigate(['/buyer-dashboard']);
        }
      })
    );
  }

  // Logout
  logout(): void {
    this.authSubject.next(null);  // Resetta lo stato dell'utente
    this.userLoggedIn = false;  // Imposta l'utente come sloggato
    localStorage.removeItem('user');  // Rimuovi l'utente dal localStorage

    // Effettua il logout dal backend
    this.http.post(`${this.baseUrl}/auth/logout`, {}).subscribe(() => {
      this.router.navigate(['/']);  // Reindirizza alla home dopo il logout
    });
  }

   // Controlla se l'utente è loggato
   isAuthenticated(): boolean {
    return !!localStorage.getItem('user');  // Verifica la presenza dell'utente nel localStorage
  }

  // Restituisce l'utente corrente
  getCurrentUser(): iUser | null {
    return this.authSubject.value;  // Assumendo che authSubject gestisca l'utente autenticato
  }
  // Metodo per ripristinare l'utente al ricaricamento della pagina
  restoreUser(): void {
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
