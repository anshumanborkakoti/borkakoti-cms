import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PostDetail } from 'src/app/models/post-detail.model';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { ThumbnailComponent } from '../thumbnail.component';
import { APPTHUMBNAILDIALOG_MODE, APPTHUMBNAIL_CONTENT_COMPONENT_MODES } from 'src/app/common/util/constants';



@Component({
  selector: 'app-thumbnail-dialog',
  templateUrl: './thumbnaildialog.component.html'
})
export class ThumbnaildialogComponent implements OnInit {

  @Input() contentMode: string;
  @Input() mode: string;
  @Input() thumbnail: Thumbnail | PostDetail;
  @Output() thumbnailSaved = new EventEmitter<Thumbnail | PostDetail>();


  private dialogRef: MatDialogRef<ThumbnailComponent>;

  constructor(private dialog: MatDialog) { }


  ngOnInit() {
    this.initObjects();
  }

  private initObjects() {
    if (this.mode === APPTHUMBNAILDIALOG_MODE.add) {
      if (this.contentMode === APPTHUMBNAIL_CONTENT_COMPONENT_MODES.thumbnail) {
        this.thumbnail = new Thumbnail();
      } else if (this.contentMode === APPTHUMBNAIL_CONTENT_COMPONENT_MODES.postDetail) {
        this.thumbnail = new PostDetail();
      }
    } else {
      this.thumbnail = this.thumbnail.clone();
    }
  }

  get isEditMode(): boolean {
    return this.mode === APPTHUMBNAILDIALOG_MODE.edit;
  }

  openDialog() {
    this.initObjects();
    this.dialogRef = this.dialog.open(ThumbnailComponent);
    this.dialogRef.componentInstance.thumbnail = this.thumbnail;
    this.dialogRef.componentInstance.mode = this.contentMode;
    this.dialogRef.componentInstance.thumbnailSaved.subscribe(data => {
      console.log(data);
      const savedThumbnail = (data as Thumbnail | PostDetail).clone();
      this.thumbnailSaved.emit(savedThumbnail);
      this.dialogRef.close();
    });
  }

}
