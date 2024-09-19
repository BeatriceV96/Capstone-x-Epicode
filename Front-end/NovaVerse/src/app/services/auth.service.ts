import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
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
  register(newUser: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/register`, newUser, {
      withCredentials: true // Rimuovi l'impostazione manuale degli headers
    }).pipe(
      tap(() => {
        this.router.navigate(['/login']);
      }),
      catchError((error) => {
        console.error('Errore durante la registrazione', error);
        throw error;
      })
    );
  }


  // Effettua il login e aggiorna lo stato dell'utente
  login(authData: IAuthData): Observable<iAuthResponse> {
    return this.http.post<iAuthResponse>(`${this.baseUrl}/auth/login`, authData, { withCredentials: true }).pipe(
      tap((res) => {
        let profilePictureUrl = res.user.profilePicture;

        // Controlla se il percorso è vuoto o non corretto
        if (profilePictureUrl && !profilePictureUrl.startsWith('http')) {
          profilePictureUrl = 'http://localhost:5034' + profilePictureUrl;
        }

        const user: iUser = {
          id: res.user.id,
          username: res.user.username,
          email: res.user.email,
          role: res.user.role,
          bio: res.user.bio,
          profilePicture: profilePictureUrl,
          createDate: res.user.createDate
        };

        this.authSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.userLoggedIn = true;

        if (res.user.role === 'Artist') {
          this.router.navigate(['/artist-dashboard']);
        } else if (res.user.role === 'Buyer') {
          this.router.navigate(['/buyer-dashboard']);
        }
      }),
      catchError((error) => {
        console.error('Errore durante il login', error);
        throw error;
      })
    );
  }



  // Effettua il logout e reimposta lo stato dell'utente
  logout(): void {
    this.authSubject.next(null);  // Resetta lo stato dell'utente
    this.userLoggedIn = false;
    localStorage.removeItem('user');  // Rimuovi l'utente dal localStorage

    // Effettua il logout dal backend
    this.http.post(`${this.baseUrl}/auth/logout`, {}, { withCredentials: true }).subscribe(
      () => {
        this.router.navigate(['/']);  // Reindirizza alla home dopo il logout
      },
      (error) => {
        console.error('Errore durante il logout', error);
      }
    );
  }

  // Controlla se l'utente è un artista
  isArtist(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'Artist';
  }

  // Controlla se l'utente è autenticato
  isAuthenticated(): boolean {
    return !!localStorage.getItem('user');  // Verifica la presenza dell'utente nel localStorage
  }

  // Restituisce l'utente corrente dal BehaviorSubject
  getCurrentUser(): iUser | null {
    const user = this.authSubject.value;
    if (user?.profilePicture && !user.profilePicture.startsWith('http')) {
      user.profilePicture = 'http://localhost:5034' + user.profilePicture;  // Aggiorna l'URL completo
    }
    return user;
  }


  getUserById(userId: number): Observable<iUser> {
    return this.http.get<iUser>(`${this.baseUrl}/users/${userId}`);
  }

  // Ripristina l'utente dal backend al caricamento della pagina
  restoreUser(): void {
    this.http.get<iUser>(`${this.baseUrl}/auth/currentUser`, { withCredentials: true }).subscribe(
      (user) => {
        // Controlla e costruisci l'URL dell'immagine del profilo
        if (user.profilePicture && !user.profilePicture.startsWith('http')) {
          user.profilePicture = 'http://localhost:5034' + user.profilePicture;
        }

        this.authSubject.next(user);  // Aggiorna il BehaviorSubject con i dati dell'utente
        localStorage.setItem('user', JSON.stringify(user));  // Salva nuovamente nel localStorage
        this.userLoggedIn = true;
      },
      (error) => {
        console.error('Errore durante il ripristino dell\'utente', error);
        this.authSubject.next(null);  // Se fallisce, imposta l'utente come non autenticato
        this.userLoggedIn = false;
        localStorage.removeItem('user');  // Rimuovi i dati utente se non è autenticato
      }
    );
  }
}
