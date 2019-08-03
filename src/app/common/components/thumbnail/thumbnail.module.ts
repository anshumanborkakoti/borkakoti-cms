import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ThumbnailComponent } from './thumbnail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsFroalaEditorModule } from '../../froala-editor/froala-editor.module';
import { ThumbnaildialogComponent } from './thumbnaildialog/thumbnaildialog.component';

@NgModule({
  declarations: [ThumbnailComponent, ThumbnaildialogComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CloudinaryModule,
    AppMaterialModuleModule,
    CmsFroalaEditorModule
  ],
  entryComponents: [ThumbnailComponent],
  exports: [ThumbnailComponent, ThumbnaildialogComponent]
})
export class ThumbnailModule { }
