import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { PostDetail } from 'src/app/models/post-detail.model';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { ThumbnailComponent, CONTENT_COMPONENT_MODES } from '../thumbnail.component';

export const DIALOG_MODE = {
  edit: 'EDIT',
  add: 'ADD'
};

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
    if (this.mode === DIALOG_MODE.add) {
      if (this.contentMode === CONTENT_COMPONENT_MODES.thumbnail) {
        this.thumbnail = new Thumbnail();
      } else if (this.contentMode === CONTENT_COMPONENT_MODES.postDetail) {
        this.thumbnail = new PostDetail();
      }
    }
  }

  get isEditMode(): boolean {
    return this.mode === DIALOG_MODE.edit;
  }

  openDialog() {
    this.dialogRef = this.dialog.open(ThumbnailComponent);
    this.dialogRef.componentInstance.thumbnail = this.thumbnail;
    this.dialogRef.componentInstance.mode = this.contentMode;
    this.dialogRef.componentInstance.thumbnailSaved.subscribe(data => {
      console.log(data);
      this.thumbnailSaved.emit(data);
      this.dialogRef.close();
    })
  }

}
