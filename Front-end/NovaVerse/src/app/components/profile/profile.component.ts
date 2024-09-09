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
  selectedFile: File | null = null; // Per l'immagine del profilo

  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe(
      (response: iUser) => {
        this.user = response;
        this.updatedBio = this.user.bio || '';
      },
      (error) => {
        console.error('Errore durante il caricamento del profilo', error);
      }
    );
  }

  enableBioEdit(): void {
    this.isEditingBio = true;
  }

  saveBio(): void {
    if (this.user) {
      const updatedUser: iUser = { ...this.user, bio: this.updatedBio };

      this.userService.updateUserProfile(updatedUser).subscribe(
        (response) => {
          this.user = response;
          this.updatedBio = this.user.bio || '';
          this.isEditingBio = false;
        },
        (error) => {
          console.error('Errore durante l\'aggiornamento del profilo', error);
        }
      );
    }
  }

  cancelBioEdit(): void {
    this.isEditingBio = false;
    this.updatedBio = this.user?.bio || '';
  }

  // Gestisce la selezione del file immagine
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  // Funzione per caricare l'immagine del profilo
  uploadProfilePicture(): void {
    if (this.selectedFile) {
      this.userService.updateProfilePicture(this.selectedFile).subscribe(
        (response) => {
          if (this.user) {
            this.user.profilePictureUrl = response.ProfilePictureUrl; // Aggiorna l'URL dell'immagine del profilo
          }
          // Ricarica il profilo utente per assicurarsi che tutte le modifiche siano aggiornate
          this.loadUserProfile();
        },
        (error) => {
          console.error('Errore durante il caricamento dell\'immagine del profilo', error);
        }
      );
    }
  }
}
