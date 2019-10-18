import { Component, OnInit, ViewChild } from '@angular/core';
import { IssuesService } from 'src/app/services/issues.service';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { Issue } from 'src/app/models/issue.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.scss']
})
export class IssuesListComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['select', 'name', 'label', 'published', 'latest', 'archived', 'actions'];
  dataSource: MatTableDataSource<Issue>;
  selection = new SelectionModel<Issue>(true, []);
  private issueSubscription = new Subscription();

  constructor(private issuesService: IssuesService) { }

  ngOnInit() {
    const allIssues = this.issuesService.getAllIssues();

    this.dataSource = new MatTableDataSource<Issue>(allIssues);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.issueSubscription = this.issuesService.getIssuesChanged().subscribe(issue => {
      if (Array.isArray(issue)) {
        this.dataSource.data = [...issue];
      } else {
        this.dataSource.data = [issue.clone()];
      }
    });
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Issue): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.label}`;
  }

  deleteSelectedIssues() {
    const selectedIssues = this.selection.selected;
    const issueIds = selectedIssues.map(aIssue => {
      return aIssue.id;
    });
    this.issuesService.deleteIssues(issueIds);
  }

  deleteIssue(issueId: string) {
    this.issuesService.deleteIssue(issueId);
  }
}
