import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsComponent } from './comments.component';
import { RouterModule, Routes } from '@angular/router';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';

const routes: Routes = [
  {
    path: '',
    component: CommentsComponent
  }
];

@NgModule({
  declarations: [CommentsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    AppMaterialModuleModule
  ],
  exports: [
    RouterModule
  ]
})
export class CommentsModule { }
