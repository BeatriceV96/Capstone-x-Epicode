import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HomeComponent } from './Pages/home/home.component';
import { AuthModule } from './auth/auth.module';
import { NavbarComponent } from './Main-component/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './Main-component/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FavoritesListComponent } from './Components_/favorites-list/favorites-list/favorites-list.component';
// **Rimuovi CategoryManagementComponent** da qui

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AuthModule,
    RouterModule,
    BrowserAnimationsModule,
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
