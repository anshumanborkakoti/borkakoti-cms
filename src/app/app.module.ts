import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModuleModule } from './app-material-module/app-material-module.module';
import { APP_BASE_HREF } from '@angular/common';
import { PostsModule } from './pages/posts/posts.module';
import { IssuesModule } from './pages/issues/issues.module';
import { CategoriesModule } from './pages/categories/categories.module';
import { UsersModule } from './pages/users/users.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModuleModule,
    PostsModule,
    IssuesModule,
    CategoriesModule,
    UsersModule
  ],
  providers: [{ provide: APP_BASE_HREF, useValue: '/' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
