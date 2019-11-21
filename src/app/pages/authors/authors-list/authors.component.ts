import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Author } from 'src/app/models/author.model';
import { Subscription } from 'rxjs';
import { AuthorsService } from 'src/app/services/authors.service';
import { MatSnackBar, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-authors',
  templateUrl: './authors.component.html',
  styleUrls: ['./authors.component.scss']
})
export class AuthorsComponent implements OnInit, OnDestroy {

  isLoading = false;
  private loadingSubscription: Subscription;
  private authorsSub: Subscription;
  private isDeletedSubscription = new Subscription();

  constructor(private authorService: AuthorsService, private snackBar: MatSnackBar) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['select', 'name', 'email', 'actions'];
  dataSource: MatTableDataSource<Author>;
  selection = new SelectionModel<Author>(true, []);

  ngOnInit() {
    this.authorsSub = this.authorService.getAuthorsObservable().subscribe(
      authors => {
        this.dataSource.data = [...authors];
      }
    );
    this.loadingSubscription = this.authorService.getIsLoadingSubject()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.dataSource = new MatTableDataSource<Author>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isDeletedSubscription = this.authorService.getIsDeleted()
      .subscribe(isDeleted => {
        if (isDeleted) {
          this.snackBar.open('Deleted successfully', 'Deleted', { duration: 5000 });
        }
      });
    this.authorService.getAuthors();
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
  checkboxLabel(row?: Author): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
  }

  deleteSelectedAuthors() {
    const selectedAuthors = this.selection.selected;
    const authorIds = selectedAuthors.map(aAuthor => {
      return aAuthor.id;
    });
    this.authorService.deleteAuthors(authorIds);
    this.selection.clear();
  }

  deleteAuthor(aAuthorId: string) {
    this.authorService.deleteAuthor(aAuthorId);
    this.selection.clear();
  }

  ngOnDestroy(): void {
    this.authorsSub.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isDeletedSubscription.unsubscribe();
  }
}
