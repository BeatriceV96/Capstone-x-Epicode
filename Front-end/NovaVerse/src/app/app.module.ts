import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';  // Usa provideHttpClient
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './Pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './Main-component/navbar/navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AuthModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),   //QUESTO IMPORTANTISSIMO, VERSIONE RECENTE
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
