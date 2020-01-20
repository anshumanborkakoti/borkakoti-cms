import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then(m => m.PostsModule)
  },
  {
    path: 'issues',
    loadChildren: () => import('./pages/issues/issues.module').then(m => m.IssuesModule),
  },
  {
    path: 'authors',
    loadChildren: () => import('./pages/authors/authors.module').then(m => m.AuthorsModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule),
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'comments',
    loadChildren: () => import('./pages/comments/comments.module').then(m => m.CommentsModule)
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
