import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssuesListComponent } from './issues-list/issues-list.component';
import { IssuesDetailComponent } from './issues-detail/issues-detail.component';

@NgModule({
  declarations: [IssuesListComponent, IssuesDetailComponent],
  imports: [
    CommonModule
  ]
})
export class IssuesModule { }
