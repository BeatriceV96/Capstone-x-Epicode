import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { iUser } from '../../Models/i-user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: iUser | null = null;
  isEditingBio: boolean = false;
  updatedBio: string = '';

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Carica i dati dell'utente
  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.updatedBio = this.user.bio || '';  // Inizializza la biografia
    }
  }

  // Abilita la modalità di modifica della biografia
  enableBioEdit(): void {
    this.isEditingBio = true;
  }

  // Salva la biografia aggiornata
  saveBio(): void {
    if (this.user) {
      const updatedUser = { ...this.user, bio: this.updatedBio };

      this.userService.updateUserProfile(updatedUser).subscribe(
        (response) => {
          this.user = response;  // Aggiorna i dati dell'utente
          this.isEditingBio = false;  // Disabilita la modalità di modifica
        },
        (error) => {
          console.error('Errore durante l\'aggiornamento del profilo', error);
        }
      );
    }
  }

  // Annulla la modifica della biografia
  cancelBioEdit(): void {
    this.isEditingBio = false;
    this.updatedBio = this.user?.bio || '';  // Resetta il valore della biografia
  }
}
