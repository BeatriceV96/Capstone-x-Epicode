import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FavoritesListComponent } from '../favorites-list/favorites-list.component';


const routes: Routes = [
  { path: '', component: FavoritesListComponent }
];

@NgModule({
  declarations: [FavoritesListComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class FavoritesModule {}
