import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssuesDetailComponent } from './issues-detail/issues-detail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { Routes, RouterModule } from '@angular/router';
import { CommonUtilsModule } from 'src/app/common/common-utils.module';
import { ReactiveFormsModule } from '@angular/forms';
import { ThumbnailModule } from 'src/app/common/components/thumbnail/thumbnail.module';

const routes: Routes = [
  {
    path: '',
    component: IssuesListComponent
  },
  {
    path: 'detail',
    component: IssuesDetailComponent
  },
  {
    path: 'detail/:id',
    component: IssuesDetailComponent
  }
]
@NgModule({
  declarations: [IssuesListComponent, IssuesDetailComponent],
  imports: [
    CommonModule,
    AppMaterialModuleModule,
    ReactiveFormsModule,
    CommonUtilsModule,
    ThumbnailModule,
    RouterModule.forChild(routes)
  ]
})
export class IssuesModule { }
