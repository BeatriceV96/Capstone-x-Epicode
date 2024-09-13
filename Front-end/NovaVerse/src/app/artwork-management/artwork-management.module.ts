import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkManagementComponent } from './artwork-management.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ArtworkManagementComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ArtworkManagementComponent }
    ])
  ]
})
export class ArtworkManagementModule { }
