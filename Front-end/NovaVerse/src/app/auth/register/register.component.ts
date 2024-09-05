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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Assicurati che AuthService sia iniettato
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      role: ['Buyer', Validators.required],  // Imposta un valore predefinito come 'Buyer'
      profilePictureUrl: [''],
      bio: ['']
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe(
        (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/']);  // Redirige alla home dopo la registrazione
        },
        (error: any) => {
          console.error('Registration failed', error);
        }
      );
    }
  }
}
