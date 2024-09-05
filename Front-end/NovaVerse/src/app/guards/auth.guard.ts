import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authSvc: AuthService, private router: Router) {}

  // Protezione delle rotte
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    if (this.authSvc.isAuthenticated()) {
      return true; // Se l'utente è autenticato, consenti l'accesso alla rotta
    } else {
      this.router.navigate(['/login']); // Se non è autenticato, reindirizza alla pagina di login
      return false;
    }
  }

  // Protezione delle rotte figlie
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return this.canActivate(childRoute, state);
  }
}
