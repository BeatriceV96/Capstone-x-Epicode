import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../../services/auth.service';
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

  constructor(private authService: AuthService, private userService: UserService, public sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.user = currentUser;
      this.updatedBio = this.user.bio || '';

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
  }

  enableBioEdit(): void {
    this.isEditingBio = true;
  }

  profilePictureBase64(byteArray: Uint8Array): string {
    return btoa(String.fromCharCode.apply(null, Array.from(byteArray)));
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
  // Funzione per caricare l'immagine del profilo
uploadProfilePicture(): void {
  if (this.selectedFile) {
    const formData = new FormData();
    formData.append('profilePicture', this.selectedFile);

    this.userService.updateProfilePicture(formData).subscribe(
      (response: any) => {
        if (this.user) {
          // Aggiorna la foto del profilo con i dati ricevuti
          this.user.profilePicture = response.profilePicture; // Ora è byte[] e non più URL
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
