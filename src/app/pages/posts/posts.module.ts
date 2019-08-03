import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsDetailComponent } from './posts-detail/posts-detail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { ThumbnailModule } from 'src/app/common/components/thumbnail/thumbnail.module';
import { CloudinaryModule } from '@cloudinary/angular-5.x';

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
    CloudinaryModule,
    AppMaterialModuleModule,
    RouterModule.forChild(routes),
    ThumbnailModule
  ],
  exports: [RouterModule]
})
export class PostsModule { }
