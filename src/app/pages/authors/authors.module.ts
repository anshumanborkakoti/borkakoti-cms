import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorsComponent } from './authors-list/authors.component';
import { AuthorsDetailComponent } from './authors-detail/authors-detail.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { CommonUtilsModule } from 'src/app/common/common-utils.module';
import { ThumbnailModule } from 'src/app/common/components/thumbnail/thumbnail.module';
import { Routes, RouterModule } from '@angular/router';
const routes: Routes = [
  {
    path: '',
    component: AuthorsComponent
  },
  {
    path: 'detail',
    component: AuthorsDetailComponent
  },
  {
    path: 'detail/:authorid',
    component: AuthorsDetailComponent
  }
];


@NgModule({
  declarations: [AuthorsComponent, AuthorsDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModuleModule,
    CommonUtilsModule,
    ThumbnailModule,
    RouterModule.forChild(routes)
  ]
})
export class AuthorsModule { }
