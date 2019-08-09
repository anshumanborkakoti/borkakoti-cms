import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModuleModule } from './app-material-module/app-material-module.module';
import { IssuesModule } from './pages/issues/issues.module';
import { CategoriesModule } from './pages/categories/categories.module';
import { HttpClientModule } from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { environment } from 'src/environments/environment';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModuleModule,
    IssuesModule,
    CategoriesModule,
    HttpClientModule,
    CloudinaryModule.forRoot(cloudinaryLib,
      {
        cloud_name: environment.cloudinary_cloud_name,
        upload_preset: environment.cloudinary_upload_preset
      })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
