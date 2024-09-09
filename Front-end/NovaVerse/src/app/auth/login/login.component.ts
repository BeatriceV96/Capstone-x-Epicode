import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string | null = null; // Variabile per gestire errori di login

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required], // Username o Email
      password: ['', Validators.required]  // Password
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const loginData = {
        username: this.loginForm.get('username')?.value,
        password: this.loginForm.get('password')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          // Reindirizzamento in base al ruolo dell'utente
          if (response.user.role === 'Artist') {
            this.router.navigate(['/artist-dashboard']);
          } else if (response.user.role === 'Buyer') {
            this.router.navigate(['/buyer-dashboard']);
          } else {
            this.router.navigate(['/home']); // Default per ruoli non previsti
          }
        },
        error: (error) => {
          console.log('Login failed:', error);
          this.loginError = 'Credenziali non valide. Riprova.'; // Gestisce l'errore di login
        }
      });
    }
  }
}
