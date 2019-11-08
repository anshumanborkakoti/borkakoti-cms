import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Category } from 'src/app/models/category.model';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] = ['select', 'name', 'label', 'actions'];
  dataSource: MatTableDataSource<Category>;
  selection = new SelectionModel<Category>(true, []);
  private categoriesSubscription = new Subscription();
  private loadingSubscription = new Subscription();
  isLoading = false;
  private isDeletedSubscription = new Subscription();

  constructor(private categoriesService: CategoryService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.categoriesSubscription = this.categoriesService.getCategoriesChanged().subscribe(
      aCategories => {
        if (Array.isArray(aCategories)) {
          this.dataSource.data = [...aCategories];
        } else {
          this.dataSource.data = [aCategories.clone()];
        }
      }
    );
    this.loadingSubscription = this.categoriesService.getIsLoading()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.dataSource = new MatTableDataSource<Category>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.isDeletedSubscription = this.categoriesService.getIsDeleted()
      .subscribe(isSaved => {
        if (isSaved) {
          this.snackBar.open('Deleted successfully', 'Deleted', { duration: 5000 });
        }
      });
    this.categoriesService.getAllCategories();
  }

  ngOnDestroy(): void {
    this.categoriesSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isDeletedSubscription.unsubscribe();

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
  checkboxLabel(row?: Category): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.label}`;
  }

  deleteSelectedCategories() {
    const selectedCategories = this.selection.selected;
    const categoryIds = selectedCategories.map(aCategory => {
      return aCategory.id;
    });
    this.categoriesService.deleteCategories(categoryIds);
    this.selection.clear();
  }

  deleteCategory(aCategoryId: string) {
    this.categoriesService.deleteCategory(aCategoryId);
    this.selection.clear();
  }
}
