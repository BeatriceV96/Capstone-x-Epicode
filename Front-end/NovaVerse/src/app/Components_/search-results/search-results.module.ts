import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SearchResultsComponent } from './search-results.component';

const routes: Routes = [
  { path: '', component: SearchResultsComponent }
];

@NgModule({
  declarations: [SearchResultsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class SearchResultsModule { }
