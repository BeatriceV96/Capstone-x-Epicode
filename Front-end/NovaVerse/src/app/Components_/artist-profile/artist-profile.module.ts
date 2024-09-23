import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtistProfileComponent } from './artist-profile.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  { path: '', component: ArtistProfileComponent }
];

@NgModule({
  declarations: [
    ArtistProfileComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class ArtistProfileModule { }
