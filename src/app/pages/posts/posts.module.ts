import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsDetailComponent } from './posts-detail/posts-detail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: PostsListComponent
  },
  {
    path: 'detail',
    component: PostsDetailComponent
  },
  {
    path: 'detail/:postid',
    component: PostsDetailComponent
  }
]

@NgModule({
  declarations: [PostsListComponent, PostsDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppMaterialModuleModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PostsModule { }
