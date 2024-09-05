import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Assicurati che il percorso sia corretto

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  constructor(private authService: AuthService) {}

  isArtist(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'Artista';  // Verifica se l'utente ha il ruolo di 'Artista'
  }
}
