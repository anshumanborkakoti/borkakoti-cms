import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PostsListComponent } from './pages/posts/posts-list/posts-list.component';
import { IssuesListComponent } from './pages/issues/issues-list/issues-list.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';

const routes: Routes = [
  {
    path: 'posts',
    component: PostsListComponent
  },
  {
    path: 'issues',
    component: IssuesListComponent
  },
  {
    path: 'categories',
    component: CategoriesListComponent
  },
  {
    path: 'users',
    component: UsersListComponent
  },
  {
    path: '',
    component: UsersListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
