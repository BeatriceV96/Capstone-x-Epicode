import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { iUser } from '../Models/i-user';
import { IAuthData } from '../Models/i-auth-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authSubject = new BehaviorSubject<null | iUser>(null);
  user$ = this.authSubject.asObservable(); // Observable per i componenti
  private isLoggedIn = false; // Stato per il login

  constructor(private http: HttpClient, private router: Router) {
    this.restoreUser();
  }

  // URL delle API del backend ASP.NET Core
  loginUrl: string = 'https://localhost:5034/api/auth/login';
  registerUrl: string = 'https://localhost:5034/api/auth/register';
  logoutUrl: string = 'https://localhost:5034/api/auth/logout'; // endpoint di logout dal backend

  // Metodo di login
  login(authData: IAuthData): Observable<iUser> {
    return this.http.post<iUser>(this.loginUrl, authData).pipe(
      tap(user => {
        this.authSubject.next(user); // Aggiorna lo stato dell'utente
        this.isLoggedIn = true; // Imposta lo stato come loggato
      })
    );
  }

  // Metodo di registrazione
  register(newUser: Partial<iUser>): Observable<iUser> {
    return this.http.post<iUser>(this.registerUrl, newUser).pipe(
      tap(user => {
        this.authSubject.next(user); // Dopo la registrazione, effettua il login automatico
        this.isLoggedIn = true;
      })
    );
  }

  // Metodo di logout
  logout(): void {
    this.http.post(this.logoutUrl, {}).subscribe(() => {
      this.authSubject.next(null); // Reset dello stato dell'utente
      this.isLoggedIn = false; // Imposta lo stato come non loggato
      this.router.navigate(['/auth/login']); // Reindirizza alla pagina di login
    });
  }

  // Metodo per ripristinare l'utente autenticato dal backend (se esiste una sessione attiva)
  restoreUser(): void {
    this.http.get<iUser>('https://localhost:5034/api/auth/currentUser').subscribe(
      user => {
        if (user) {
          this.authSubject.next(user); // Ripristina l'utente se c'è una sessione attiva
          this.isLoggedIn = true;
        }
      },
      () => {
        this.authSubject.next(null); // Se non ci sono sessioni attive, resetta lo stato
      }
    );
  }

  // Metodo per sapere se l'utente è loggato
  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }
}
