import { NgModule } from '@angular/core';
import { FroalaViewModule, FroalaEditorModule } from 'angular-froala-wysiwyg';
import 'froala-editor/js/plugins.pkgd.min';
import 'froala-editor/js/third_party/spell_checker.min';



@NgModule({
  declarations: [],
  imports: [
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot()
  ],
  exports: [FroalaEditorModule, FroalaViewModule]
})
export class CmsFroalaEditorModule { }
