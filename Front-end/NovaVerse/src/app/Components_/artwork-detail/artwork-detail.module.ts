import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtworkDetailComponent } from './artwork-detail.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Per il two-way binding

@NgModule({
  declarations: [ArtworkDetailComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', component: ArtworkDetailComponent }
    ])
  ]
})
export class ArtworkDetailModule {}
