import { Component, OnInit, Input, AfterViewInit, OnDestroy, Output, ChangeDetectorRef } from '@angular/core';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { Image } from 'src/app/models/image.model';
import { environment } from 'src/environments/environment';
import { WindowRef } from '../../services/window.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from 'src/app/app-material-module/error-state-matcher';
import { EventEmitter } from '@angular/core';
import { FROALA_EDITOR_OPTIONS } from '../../froala-editor/options.froala';
import { PostDetail } from 'src/app/models/post-detail.model';

export const CONTENT_COMPONENT_MODES = {
  postDetail: 'POST_DETAIL',
  thumbnail: 'THUMBNAIL'
};

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: [
    './thumbnail.component.scss'
  ]
})
export class ThumbnailComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() thumbnail: Thumbnail | PostDetail;
  @Input() mode: string = CONTENT_COMPONENT_MODES.thumbnail;
  @Output() thumbnailSaved = new EventEmitter<Thumbnail | PostDetail>();

  clImages: Image[];
  mediaLibrary: any;
  thumbnailForm: FormGroup;
  thumbnailErrorStateMatcher = new MyErrorStateMatcher();
  froalaOptions = FROALA_EDITOR_OPTIONS;

  constructor(
    private window: WindowRef,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.thumbnail = this.thumbnail.clone();
    const publicId: string = this.thumbnail.image ? this.thumbnail.image.publicId : null;
    this.froalaOptions.charCounterMax = this.thumbnail.maxCharCount;
    this.attachFroalaContentChanged();
    this.thumbnailForm = new FormGroup({
      header: new FormControl(this.thumbnail.header, [Validators.required, Validators.maxLength(50)]),
      image: new FormControl(publicId, Validators.required),
      content: new FormControl(this.thumbnail.content),
      caption: new FormControl(this.thumbnail.caption, Validators.maxLength(100)),
      footer: new FormControl(this.thumbnail.footer, Validators.maxLength(50))
    });
  }

  private attachFroalaContentChanged(): void {
    const self = this;
    this.froalaOptions.events = {
      contentChanged() {
        self.cd.detectChanges();
      }
    }
  }

  saveData() {
    if (this.thumbnailForm.valid) {
      this.thumbnail.header = this.thumbnailForm.value.header;
      this.thumbnail.image.publicId = this.thumbnailForm.value.image;
      this.thumbnail.content = this.thumbnailForm.value.content;
      this.thumbnail.caption = this.thumbnailForm.value.caption;
      this.thumbnail.footer = this.thumbnailForm.value.footer;
      this.thumbnailSaved.emit(this.thumbnail.clone());
    }
  }

  get dialogTitle() {
    if (this.mode === CONTENT_COMPONENT_MODES.postDetail) {
      return 'Add content for the Post';
    } else {
      return 'Add content for the Thumbnail';
    }
  }

  showErrorIf(controlName: string, errorName: string) {
    const errors = this.thumbnailForm.get(controlName).errors;
    return !this.thumbnailForm.get(controlName).valid && errors && errors[errorName] && this.thumbnailForm.touched;
  }

  ngAfterViewInit(): void {
    this.mediaLibrary = this.window.cloudinary
      .createMediaLibrary(
        {
          cloud_name: environment.cloudinary_cloud_name,
          api_key: environment.cloudinary_api_key,
          multiple: false
        },
        {
          insertHandler: data => {
            // Response data
            // { assets: Array(1), mlId: "ml_0" }
            // assets: Array(1)
            // 0:
            // bytes: 4192750
            // created_at: "2019-07-08T14:49:59Z"
            // duration: null
            // format: "jpg"
            // height: 3264
            // public_id: "tljnesandbox/Typewriter_main_page"
            // resource_type: "image"
            // secure_url: "https://res.cloudinary.com/dcom6pwyq/image/upload/v1562597399/tljnesandbox/Typewriter_main_page.jpg"
            // tags: []
            // type: "upload"
            // url: "http://res.cloudinary.com/dcom6pwyq/image/upload/v1562597399/tljnesandbox/Typewriter_main_page.jpg"
            // version: 1562597399
            // width: 4896
            // __proto__: Object
            // length: 1
            // __proto__: Array(0)
            // mlId: "ml_0"
            // __proto__: Object
            data.assets.forEach(aAsset => {
              this.thumbnail.image = new Image(aAsset.public_id, aAsset.format, aAsset.tags, aAsset.secure_url, aAsset.url);
            });
            this.thumbnailForm.get('image').setValue(this.thumbnail.image.publicId);
          }
        }
      );
  }

  showMl() {
    this.mediaLibrary.show({
      folder: { path: environment.cloudinary_folder_name, resource_type: 'image' }
    });
  }

  ngOnDestroy(): void {
    this.mediaLibrary = null;
    this.thumbnailForm = null;
  }

}
