import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ThumbnailComponent } from './thumbnail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ThumbnailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CloudinaryModule,
    AppMaterialModuleModule
  ],
  exports: [ThumbnailComponent]
})
export class ThumbnailModule { }
