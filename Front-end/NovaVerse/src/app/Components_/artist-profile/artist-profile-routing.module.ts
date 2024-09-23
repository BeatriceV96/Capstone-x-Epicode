import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtistProfileComponent } from './artist-profile.component';

const routes: Routes = [{ path: ':id', component: ArtistProfileComponent }];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtistProfileRoutingModule { }
