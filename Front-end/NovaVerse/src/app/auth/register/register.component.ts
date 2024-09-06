import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service'; // Importa AuthService
import { Router } from '@angular/router'; // Per la navigazione

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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Buyer', Validators.required],
      profilePictureUrl: [''],
      bio: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;  // Mostra il caricamento
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Registrazione avvenuta con successo', response);
          this.isLoading = false;  // Nascondi il caricamento
          this.router.navigate(['/']);  // Reindirizza alla home dopo la registrazione
        },
        (error: any) => {
          console.error('Registrazione fallita', error);
          this.isLoading = false;  // Nascondi il caricamento anche in caso di errore
        }
      );
    }
  }
}
