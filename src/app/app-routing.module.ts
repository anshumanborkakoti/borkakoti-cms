import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { AuthorsComponent } from './pages/authors/authors.component';

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
    component: AuthorsComponent,
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
