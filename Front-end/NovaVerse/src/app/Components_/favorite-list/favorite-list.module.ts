import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FavoriteListRoutingModule } from './favorite-list-routing.module';
import { FavoriteListComponent } from './favorite-list.component';


@NgModule({
  declarations: [
    FavoriteListComponent
  ],
  imports: [
    CommonModule,
    FavoriteListRoutingModule
  ]
})
export class FavoriteListModule { }
