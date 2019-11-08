import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoriesDetailComponent } from './categories-detail/categories-detail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonUtilsModule } from 'src/app/common/common-utils.module';
import { ThumbnailModule } from 'src/app/common/components/thumbnail/thumbnail.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: CategoriesListComponent
  },
  {
    path: 'detail',
    component: CategoriesDetailComponent
  },
  {
    path: 'detail/:id',
    component: CategoriesDetailComponent
  }
]

@NgModule({
  declarations: [CategoriesListComponent, CategoriesDetailComponent],
  imports: [
    CommonModule,
    AppMaterialModuleModule,
    ReactiveFormsModule,
    CommonUtilsModule,
    ThumbnailModule,
    RouterModule.forChild(routes)
  ]
})
export class CategoriesModule { }
