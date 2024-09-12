import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { ArtworkListComponent } from './components/artwork-list/artwork-list.component';
import { ProfileComponent } from './components/profile/profile.component';
import { AuthGuard } from './guards/auth.guard';
import { ArtistGuard } from './guards/artist.guard';
import { ArtworkManagementComponent } from './components/artwork-management/artwork-management.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },

  // Lista delle categorie
  { path: 'categories', component: CategoryListComponent },

  // Dettaglio di una singola categoria
  { path: 'categories/:id', component: CategoryDetailComponent },

  // Gestione delle categorie, accessibile solo agli artisti
  { path: 'category-management', component: CategoryManagementComponent, canActivate: [ArtistGuard] },

  // Visualizza opere in una specifica categoria
  {
    path: 'categories/:id/artworks',
    component: ArtworkListComponent
  }
  , // Visualizza opere
  { path: 'categories/:id/artworks/manage', component: ArtworkManagementComponent, canActivate: [ArtistGuard] }, // Gestione opere

  // Profilo utente
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },

  // Modulo di autenticazione lazy-loaded
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },

  // Gestisci rotte non valide
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
