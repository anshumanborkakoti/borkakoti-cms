import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../posts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Issue } from 'src/app/models/issue.model';
import { MyErrorStateMatcher } from 'src/app/app-material-module/error-state-matcher';
import { showErrorIf, makeid } from 'src/app/common/util/utils';
import { MatPaginator, MatSort, MatTableDataSource, MatSnackBar } from '@angular/material';
import { Edit } from 'src/app/models/edit.model';
import { AuthorsService } from 'src/app/services/authors.service';
import { CategoryService } from 'src/app/services/category.service';
import { IssuesService } from 'src/app/services/issues.service';
import { Author } from 'src/app/models/author.model';
import { User } from 'src/app/models/user.model';
import { Subscription } from 'rxjs';
import { DETAIL_MODES } from 'src/app/common/util/constants';
import { UsersService } from '../../users/users.service';

@Component({
  selector: 'app-posts-detail',
  templateUrl: './posts-detail.component.html',
  styleUrls: ['./posts-detail.component.scss']
})
export class PostsDetailComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  editDataSource: MatTableDataSource<Edit>;
  postForm: FormGroup;
  post: Post;
  myErrorStateMatcher = new MyErrorStateMatcher();
  showErrorIf = showErrorIf;
  displayedEditColumns = ['editor', 'comment', 'date'];

  /** Catgeories */
  allCategories: Category[];

  /** Issues */
  allIssues: Issue[];

  /** Authors */
  allAuthors: Author[];

  /** Users */
  allUsers: User[];

  private categorySubscription = new Subscription();
  private authorSubscription = new Subscription();
  private issuesSubscription = new Subscription();
  private userSubscription = new Subscription();
  private mode: string;
  isLoading = false;
  private loadingSubscription = new Subscription();
  private isSavedSubscription = new Subscription();

  ngOnDestroy(): void {
    this.categorySubscription.unsubscribe();
    this.issuesSubscription.unsubscribe();
    this.authorSubscription.unsubscribe();
    this.loadingSubscription.unsubscribe();
    this.isSavedSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }


  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private authorService: AuthorsService,
    private categoryService: CategoryService,
    private issueService: IssuesService,
    private router: Router,
    private snackBar: MatSnackBar,
    private userService: UsersService
  ) { }

  private initCategories() {
    this.categorySubscription = this.categoryService.getCategoriesChanged()
      .subscribe(aCategories => {
        if (Array.isArray(aCategories)) {
          this.allCategories = aCategories;
        }
      });
    this.categoryService.getAllCategories();
  }

  private initUsers() {
    this.userSubscription = this.userService.getUsersObservable()
      .subscribe(aUsers => {
        this.allUsers = [...aUsers];
        if (this.allUsers.length > 0) {
          // TODO remove
          this.post.assignedTo = this.allUsers[0];
        }
      });
    this.userService.getUsers();
  }

  private initIssues() {
    this.issuesSubscription = this.issueService.getIssuesChanged().subscribe(issues => {
      if (Array.isArray(issues)) {
        this.allIssues = issues.slice();
      }
    });
    this.issueService.getAllIssues();

  }

  private initAuthors() {
    this.authorSubscription = this.authorService
      .getAuthorsObservable()
      .subscribe(authors => this.allAuthors = authors.slice());
    this.authorService.getAuthors();
  }

  ngOnInit() {
    const postid = this.activatedRoute.snapshot.params.postid;
    this.mode = this.activatedRoute.snapshot.queryParamMap.get('mode');
    this.loadingSubscription = this.postService.getIsLoading()
      .subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.isSavedSubscription = this.postService.getIsSaved()
      .subscribe(isSaved => {
        if (isSaved) {
          this.router.navigate(['posts']);
          this.snackBar.open('Saved successfully', 'Saved', { duration: 5000 });
        }
      });
    if (this.mode === DETAIL_MODES.create) {
      this.post = new Post();
      this.post.category = new Category();
      this.post.issues = [];
      this.post.authors = [];
    } else if (this.mode === DETAIL_MODES.update) {
      this.post = this.postService.getPost(postid);
      if (!this.post) {
        this.router.navigate(['posts']);
      }
      this.post = this.post.clone();
    }

    this.initCategories();
    this.initEditTable();
    this.initIssues();
    this.initAuthors();
    this.initUsers();
    this.initForm();
  }

  private initForm() {
    this.postForm = new FormGroup({
      label: new FormControl(this.post.label, [Validators.required, Validators.maxLength(15)]),
      approved: new FormControl(this.post.approved),
      archived: new FormControl(this.post.archived),
      category: new FormControl(this.post.category.id, [Validators.required]),
      issues: new FormControl(this.post.issues.map(issue => issue.id)), // TODO Convert to issue object
      authors: new FormControl(this.post.authors.map(author => author.id), [Validators.required]), // TODO Convert to author object
      editComment: new FormControl('', [Validators.required, Validators.maxLength(1000)])
    });
  }

  private initEditTable() {
    this.editDataSource = new MatTableDataSource<Edit>(this.post.editHistory.slice());
    this.editDataSource.paginator = this.paginator;
    this.editDataSource.sort = this.sort;
    this.editDataSource.sortingDataAccessor = (anEdit, aColumnId): string | number => {
      switch (aColumnId) {
        case 'editor':
          return anEdit.editor.name;
        case 'date':
          return anEdit.date.getTime();
        default:
          return anEdit[aColumnId];
      }
    };
  }
  savePost() {
    const values = this.postForm.value;
    this.post.label = values.label;
    this.post.approved = values.approved;
    this.post.archived = values.archived;
    this.post.category = this.categoryService.getCategory(values.category);
    this.post.issues = [...values.issues].map(issueId => this.issueService.getIssue(issueId));
    this.post.authors = [...values.authors].map(aAuthorId => this.authorService.getAuthor(aAuthorId));
    this.post.editHistory = [...this.post.editHistory, new Edit(this.post.assignedTo, values.editComment, new Date(), makeid(20))];
    console.log(this.postForm);
    console.log(this.post);
    if (DETAIL_MODES.create === this.mode) {
      this.postService.savePost(this.post.clone());
    } else if (DETAIL_MODES.update === this.mode) {
      this.postService.updatePost(this.post.clone());
    }
  }

  onTabsChanged(data: Post) {
    this.post.detail = data.detail;
    this.post.thumbnail = data.thumbnail;
    this.post.content = data.content;
  }
}
