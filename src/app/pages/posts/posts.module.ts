import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsListComponent } from './posts-list/posts-list.component';
import { PostsDetailComponent } from './posts-detail/posts-detail.component';

@NgModule({
  declarations: [PostsListComponent, PostsDetailComponent],
  imports: [
    CommonModule
  ],
  exports: [
    PostsListComponent,
    PostsDetailComponent]
})
export class PostsModule { }
