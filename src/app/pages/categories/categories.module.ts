import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesDetailComponent } from './categories-detail/categories-detail.component';

@NgModule({
  declarations: [CategoriesListComponent, CategoriesDetailComponent],
  imports: [
    CommonModule
  ]
})
export class CategoriesModule { }
