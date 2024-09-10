import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryListComponent } from './components/category-list/category-list.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { ArtworkListComponent } from './components/artwork-list/artwork-list.component';
import { ArtworkManagementComponent } from './components/artwork-management/artwork-management.component';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },  // Dinamica per visualizzare i dettagli della categoria
  { path: 'category-management', component: CategoryManagementComponent },
  { path: 'categories/:id/artworks', component: ArtworkListComponent }, // Lista delle opere per una categoria specifica
  { path: 'categories/:id/artworks/manage', component: ArtworkManagementComponent }, // Gestione delle opere da parte dell'artista
  { path: 'profile', component: ProfileComponent },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
