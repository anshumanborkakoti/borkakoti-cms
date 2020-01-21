import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  template:
    `<div mat-dialog-title style="color:red">An error occurred!</div>
<div mat-dialog-content>{{ data.message }}</div>
<div mat-dialog-actions>
  <button mat-dialog-close mat-raised-button color="primary">Ok</button>
</div>`
})
export class UnauthorizedComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) { }
}
