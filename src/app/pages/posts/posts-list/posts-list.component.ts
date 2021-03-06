import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../posts.service';
import { MatTableDataSource, MatPaginator, MatSort, MatSnackBar } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit, OnDestroy {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  dataSource: MatTableDataSource<Post>;
  displayedColumns: string[] = ['select', 'label', 'authors', 'issues', 'categories', 'published', 'approved', 'archived', 'actions'];
  selection = new SelectionModel<Post>(true, []);
  private postSubscription: Subscription;
  private filterValue: string;

  isLoading = false;
  private loadingSubscription: Subscription;
  private isDeletedSubscription = new Subscription();


  constructor(private postsService: PostService, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.postSubscription = this.postsService.getPostsChanged()
      .subscribe(aPosts => {
        this.dataSource.data = [...aPosts];
        this.selection.clear();
      });
    this.dataSource = new MatTableDataSource<Post>([]);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filter = this.filterValue;

    this.loadingSubscription = this.postsService.getIsLoading()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.isDeletedSubscription = this.postsService.getIsDeleted()
      .subscribe(isDeleted => {
        if (isDeleted) {
          this.snackBar.open('Deleted successfully', 'Deleted', { duration: 5000 });
        }
      });

    this.postsService.getAllPosts();
  }

  ngOnDestroy(): void {
    this.postSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isDeletedSubscription.unsubscribe();
  }

  applyFilter(filterValue: string) {
    this.filterValue = filterValue.trim().toLowerCase();
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  deleteSelectedPosts() {
    const selectedPosts: Post[] = this.selection.selected;
    const postIds = selectedPosts.map(aPost => {
      return aPost.id;
    });
    this.postsService.deletePosts(postIds);
  }

  deletePost(postId: string) {
    this.postsService.deletePost(postId);
  }

}
