import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthorizationGuard } from './auth/authorisation/authorization.guard';
const routes: Routes = [
  {
    path: 'posts',
    loadChildren: () => import('./pages/posts/posts.module').then(m => m.PostsModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'issues',
    loadChildren: () => import('./pages/issues/issues.module').then(m => m.IssuesModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'authors',
    loadChildren: () => import('./pages/authors/authors.module').then(m => m.AuthorsModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'categories',
    loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'users',
    loadChildren: () => import('./pages/users/users.module').then(m => m.UsersModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'comments',
    loadChildren: () => import('./pages/comments/comments.module').then(m => m.CommentsModule),
    canActivate: [AuthGuard, AuthorizationGuard]
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: '**',
    redirectTo: '/auth/login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
