import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ArtistGuard implements CanActivate {

  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): boolean {
    const user = this.authSvc.getCurrentUser();
    if (user && user.role === 'Artist') {
      return true; // L'utente è un artista
    } else {
      this.router.navigate(['/']); // Reindirizza alla home o altra pagina se non è un artista
      return false;
    }
  }
}
