import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { iUser } from '../../Models/i-user';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { Artwork } from '../../Models/artwork';
import { ArtworkService } from '../../services/artwork.service';
import { Router } from '@angular/router';

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
  artworks: Artwork[] = [];  // Lista delle opere dell'artista
  profileImageUrl: any;  // Variabile per visualizzare l'immagine
  isImageSaved: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private artworkService: ArtworkService,
    private router: Router,
    public sanitizer: DomSanitizer)
    { }

    ngOnInit(): void {
      this.loadUserProfile();  // Call this when the component is initialized
    }

    loadUserProfile(): void {
      this.userService.getUserProfile().subscribe(
        (response: iUser) => {
          this.user = response;

          // Assicurati che l'URL dell'immagine sia completo
          if (this.user.profilePicture?.startsWith('/uploads')) {
            this.profileImageUrl = 'http://localhost:5034' + this.user.profilePicture;
          } else if (this.user.profilePicture) {
            this.profileImageUrl = 'http://localhost:5034/uploads/' + this.user.profilePicture;
          }

          console.log("Profile Image URL:", this.profileImageUrl);  // Aggiungi questo log per vedere il percorso dell'immagine
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
      const updatedUser: iUser = {
        ...this.user,
        bio: this.updatedBio,
        role: this.user.role || 'Artist'  // Assicurati che il ruolo sia impostato
      };

      console.log("Dati inviati al server per l'aggiornamento del profilo:", updatedUser);

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
    this.updatedBio = this.user?.bio || ''; // Ripristina la biografia originale
  }

  // Gestisce la selezione del file immagine
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadProfilePicture(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('profilePicture', this.selectedFile);

      this.userService.updateProfilePicture(formData).subscribe(
        (response: any) => {
          // Aggiorna l'URL dell'immagine del profilo con la nuova immagine caricata
          this.profileImageUrl = 'http://localhost:5034' + response.profilePicture;
          if (this.user) {
            this.user.profilePicture = response.profilePicture; // Salva il percorso dell'immagine nel profilo utente
          }
        },
        (error) => {
          console.error('Errore durante il caricamento dell\'immagine del profilo', error);
        }
      );
    }
  }

  goToHome(): void {
    this.router.navigate(['/']);  // Naviga alla home
  }

}
