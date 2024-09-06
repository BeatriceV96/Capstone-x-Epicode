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
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { RouterModule } from '@angular/router';
import { CategoryListComponent } from './components/category-list/category-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    CategoryManagementComponent,
    CategoryListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    AuthModule,
    RouterModule
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),   //QUESTO IMPORTANTISSIMO, VERSIONE RECENTE
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
