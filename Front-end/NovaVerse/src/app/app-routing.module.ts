import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Pages/home/home.component';
import { CategoryDetailComponent } from './components/category-detail/category-detail.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CategoryManagementComponent } from './components/category-management/category-management.component';
import { CategoryListComponent } from './components/category-list/category-list.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'categories', component: CategoryListComponent },
  { path: 'category-management', component: CategoryManagementComponent },
  { path: 'categories/:id', component: CategoryDetailComponent },  // Rotta dinamica per categorie
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
