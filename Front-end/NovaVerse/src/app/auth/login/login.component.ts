import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IAuthData } from '../../Models/i-auth-data';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  authData:IAuthData = {
    email:'',
    password:''
  }

  constructor(private authSvc:AuthService, private router:Router) { }

  login(){
    this.authSvc.login(this.authData)
    .subscribe(()=>{
      this.router.navigate(['/dashboard'])
    })
  }
}
