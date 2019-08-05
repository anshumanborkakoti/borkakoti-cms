import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { APPTHUMBNAIL_CONTENT_COMPONENT_MODES, APPTHUMBNAILDIALOG_MODE } from 'src/app/common/util/constants';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { PostDetail } from 'src/app/models/post-detail.model';
import { Post } from 'src/app/models/post.model';
import { cloneCmsClass, cloneCmsClassArray } from 'src/app/common/util/utils';

@Component({
  selector: 'app-thumbnail-tabs',
  templateUrl: './thumbnail-tabs.component.html',
  styleUrls: ['./thumbnail-tabs.component.scss']
})
export class ThumbnailTabsComponent implements OnInit {

  @Input() post: Post;
  @Output() tabsChanged = new EventEmitter<Post>();

  thumbnailContentModes = APPTHUMBNAIL_CONTENT_COMPONENT_MODES;
  thumbnailDialogModes = APPTHUMBNAILDIALOG_MODE;
  selectedTabIndex: number;

  constructor(private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.initObjects();
    this.selectedTabIndex = this.post.detail.length - 1;
    this.tabsChanged.subscribe(apost => {
      this.selectedTabIndex = apost.detail.length - 1;
    });
  }

  private initObjects() {
    if (this.post) {
      // If post provided, clone thumbnail, detail
      cloneCmsClass(this.post.thumbnail);
      cloneCmsClassArray(this.post.detail);
    } else {
      // If no post provided, create a new post
      this.post = new Post();
    }
    if (!this.post.detail) {
      this.post.detail = [];
    }
  }

  onSaved(data: Thumbnail | PostDetail): void {
    console.log('PostDetail saved');
    console.log(data);
    if (data instanceof PostDetail) {
      this.post.detail.push(data.clone());
    } else if (data instanceof Thumbnail) {
      this.post.thumbnail = data.clone();
    }
    this.tabsChanged.emit(this.post);
  }

  onThumbnailEdited(data: Thumbnail) {
    console.log('PostDetail edited');
    console.log(data);
    this.post.thumbnail = data.clone();
    this.tabsChanged.emit(this.post);
  }

  onDetailEdited(data: PostDetail) {
    const index = this.post.detail.findIndex(aPost => {
      return data.id === aPost.id;
    });
    this.post.detail.splice(index, 1, data.clone());
    this.tabsChanged.emit(this.post);
  }

  onThumbnailDeleted(data: boolean) {
    if (data === true) {
      this.post.thumbnail = null;
    }
  }

  onDetailDeleted(data: boolean, index: number) {
    if (data === true) {
      this.post.detail.splice(index, 1);
    }
  }
}
