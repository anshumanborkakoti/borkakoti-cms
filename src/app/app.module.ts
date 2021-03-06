import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModuleModule } from './app-material-module/app-material-module.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { Cloudinary } from 'cloudinary-core';
import { environment } from 'src/environments/environment';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error/error.interceptor';
import { AuthenticationInterceptor } from './auth/auth.interceptor';
import { UnauthorizedComponent } from './auth/authorisation/unauthorized.component';

export const cloudinaryLib = {
  Cloudinary: Cloudinary
};

@NgModule({
  declarations: [AppComponent, ErrorComponent, UnauthorizedComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppMaterialModuleModule,
    HttpClientModule,
    CloudinaryModule.forRoot(cloudinaryLib,
      {
        cloud_name: environment.cloudinary_cloud_name,
        upload_preset: environment.cloudinary_upload_preset
      })
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ErrorComponent,
    UnauthorizedComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthenticationInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
