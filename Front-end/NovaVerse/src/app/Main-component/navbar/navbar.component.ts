import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  // Metodo per controllare se l'utente è loggato
  isLoggedIn(): boolean {
    return this.authService.isAuthenticated(); // Verifica se l'utente è autenticato
  }

  // Metodo per eseguire il logout
  onLogout(): void {
    this.authService.logout();  // Esegui il logout
  }
}
