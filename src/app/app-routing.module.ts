import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { PostsListComponent } from './pages/posts/posts-list/posts-list.component';
import { IssuesListComponent } from './pages/issues/issues-list/issues-list.component';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';

const routes: Routes = [
  {
    path: 'posts',
    component: PostsListComponent
  },
  {
    path: 'issues',
    component: IssuesListComponent,
  },
  {
    path: 'categories',
    component: CategoriesListComponent
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
  },
  {
    path: '**',
    redirectTo: '/users'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
