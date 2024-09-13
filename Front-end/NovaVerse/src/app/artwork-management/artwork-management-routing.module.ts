import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArtworkManagementComponent } from './artwork-management.component';

const routes: Routes = [{ path: '', component: ArtworkManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ArtworkManagementRoutingModule { }
