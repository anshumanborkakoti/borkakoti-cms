import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CloudinaryModule } from '@cloudinary/angular-5.x';
import { ThumbnailComponent } from './thumbnail.component';
import { AppMaterialModuleModule } from 'src/app/app-material-module/app-material-module.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CmsFroalaEditorModule } from '../../froala-editor/froala-editor.module';
import { ThumbnaildialogComponent } from './thumbnaildialog/thumbnaildialog.component';
import { ThumbnailViewComponent } from './thumbnail-view/thumbnail-view.component';
import { ThumbnailTabsComponent } from './thumbnail-tabs/thumbnail-tabs.component';

@NgModule({
  declarations: [ThumbnailComponent, ThumbnaildialogComponent, ThumbnailViewComponent, ThumbnailTabsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CloudinaryModule,
    AppMaterialModuleModule,
    CmsFroalaEditorModule
  ],
  entryComponents: [ThumbnailComponent],
  exports: [ThumbnailComponent, ThumbnaildialogComponent, ThumbnailViewComponent, ThumbnailTabsComponent]
})
export class ThumbnailModule { }
