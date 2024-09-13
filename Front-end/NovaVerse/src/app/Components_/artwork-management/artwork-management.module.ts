import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkManagementComponent } from './artwork-management.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ArtworkManagementComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ArtworkManagementComponent }
    ])
  ]
})
export class ArtworkManagementModule { }
