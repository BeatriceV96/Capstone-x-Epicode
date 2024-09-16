import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { AuthGuard } from './guards/auth.guard';
import { ArtistGuard } from './guards/artist.guard';


const routes: Routes = [
  { path: '', component: HomeComponent },

  // Lazy-loaded Category List
  { path: 'categories', loadChildren: () => import('./Components_/category-list/category-list.module').then(m => m.CategoryListModule) },

  // Lazy-loaded Artwork List
  { path: 'categories/:id/artworks', loadChildren: () => import('./Components_/artwork-list/artwork-list.module').then(m => m.ArtworkListModule) },

  // Lazy-loaded Category Management, accessibile solo agli artisti
  { path: 'category-management', loadChildren: () => import('./Components_/category-management/category-management.module').then(m => m.CategoryManagementModule), canActivate: [ArtistGuard] },

  // Lazy-loaded Artwork Management, accessibile solo agli artisti
  { path: 'categories/:id/artworks/manage', loadChildren: () => import('./Components_/artwork-management/artwork-management.module').then(m => m.ArtworkManagementModule), canActivate: [ArtistGuard] },

  // Lazy-loaded Profile
  { path: 'profile', loadChildren: () => import('./Components_/profile/profile.module').then(m => m.ProfileModule), canActivate: [AuthGuard] },

  // Lazy-loaded Artwork Detail'
  { path: 'artworks/:id', loadChildren: () => import('./Components_/artwork-detail/artwork-detail.module').then(m => m.ArtworkDetailModule) },

  // Modulo di autenticazione lazy-loaded
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'cart', loadChildren: () => import('./Components_/cart/cart.module').then(m => m.CartModule) },

  // Gestisci rotte non valide
  { path: '**', redirectTo: '', pathMatch: 'full' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
