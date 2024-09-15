import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  successMessage: string = '';
  errorMessage: string = '';
  selectedFile: File | null = null;  // Per gestire l'upload del file

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Buyer', Validators.required],  // Default role as Buyer
      bio: [''],
      profilePicture: [null]  // Campo per l'immagine del profilo
    });
  }

  // Metodo per gestire il caricamento dell'immagine
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  // Metodo di invio del modulo
  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const formData = new FormData();
      formData.append('username', this.registerForm.get('username')?.value);
      formData.append('email', this.registerForm.get('email')?.value);
      formData.append('password', this.registerForm.get('password')?.value);
      formData.append('role', this.registerForm.get('role')?.value);
      formData.append('bio', this.registerForm.get('bio')?.value);

      // Se esiste un file selezionato, aggiungilo a formData
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile);  // Aggiungi il file immagine
      }

      // Aggiungi l'URL dell'immagine del profilo se esiste
      if (this.registerForm.get('profilePictureUrl')?.value) {
        formData.append('profilePictureUrl', this.registerForm.get('profilePictureUrl')?.value);
      }

      this.authService.register(formData).subscribe(
        (response) => {
          console.log('Registrazione avvenuta con successo', response);
          this.isLoading = false;
          this.router.navigate(['/']);
        },
        (error: any) => {
          console.error('Registrazione fallita', error);
          this.isLoading = false;
        }
      );
    } else {
      this.errorMessage = "Tutti i campi sono obbligatori e devi caricare un'immagine o fornire un URL.";
    }
  }
}
