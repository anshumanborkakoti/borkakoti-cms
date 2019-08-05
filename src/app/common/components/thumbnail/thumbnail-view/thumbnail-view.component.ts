import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { PostDetail } from 'src/app/models/post-detail.model';


@Component({
  selector: 'app-thumbnail-view',
  templateUrl: './thumbnail-view.component.html'
})
export class ThumbnailViewComponent implements OnInit {
  @Input() thumbnail: Thumbnail | PostDetail;
  @Output() thumbnailEdited = new EventEmitter<Thumbnail | PostDetail>();
  @Output() thumbnailDeleted = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
    this.thumbnail = this.thumbnail.clone();
  }

  onThumbnailEdited(data: Thumbnail | PostDetail) {
    this.thumbnail = data.clone();
    this.thumbnailEdited.emit(this.thumbnail);
  }

  onDelete() {
    this.thumbnail = null;
    this.thumbnailDeleted.emit(true);
  }
}
