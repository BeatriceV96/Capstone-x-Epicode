import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArtworkListRoutingModule } from './artwork-list-routing.module';
import { ArtworkListComponent } from './artwork-list.component';


@NgModule({
  declarations: [
    ArtworkListComponent
  ],
  imports: [
    CommonModule,
    ArtworkListRoutingModule
  ]
})
export class ArtworkListModule { }
