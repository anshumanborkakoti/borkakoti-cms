import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Issue } from 'src/app/models/issue.model';
import { MyErrorStateMatcher } from 'src/app/app-material-module/error-state-matcher';
import { showErrorIf } from 'src/app/common/util/utils';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Edit } from 'src/app/models/edit.model';
import { AuthorsService } from 'src/app/services/authors.service';
import { CategoryService } from 'src/app/services/category.service';
import { IssuesService } from 'src/app/services/issues.service';
import { Author } from 'src/app/models/author.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-posts-detail',
  templateUrl: './posts-detail.component.html',
  styleUrls: ['./posts-detail.component.scss']
})
export class PostsDetailComponent implements OnInit {

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

  private categorySubscription = new Subscription();

  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute,
    private authorService: AuthorsService,
    private categoryService: CategoryService,
    private issueService: IssuesService
  ) { }

  private initCategories() {
    this.categoryService.getAllCategories();
    this.categorySubscription = this.categoryService.getCategoriesChanged()
      .subscribe(aCategories => {
        if (Array.isArray(aCategories)) {
          this.allCategories = aCategories;
        }
      });
  }

  private initIssues() {
    this.issueService.getIssuesChanged().subscribe(issues => {
      if (Array.isArray(issues)) {
        this.allIssues = issues.slice();
      }
    });
    this.issueService.getAllIssues();

  }

  private initAuthors() {
    this.allAuthors = this.authorService.getAllAuthors();
  }

  ngOnInit() {
    const postid = this.activatedRoute.snapshot.params.postid;
    this.post = this.postService.getPost(postid);
    if (!this.post) {
      this.post = new Post();
      this.post.category = this.categoryService.MOCK_CATEGORY;
      this.post.issues = this.issueService.MOCK_ISSUES;
      this.post.authors = this.authorService.MOCK_AUTHORS;
    } else {
      this.post = this.post.clone();
    }

    this.initCategories();
    this.initEditTable();
    this.initIssues();
    this.initAuthors()
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
    this.editDataSource = new MatTableDataSource<Edit>(this.post.editHistory);
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
    }
  }
  savePost() {
    console.log(this.postForm);
    console.log(this.post.thumbnail);
    //Call save service
  }

  onTabsChanged(data: Post) {
    this.post.detail = data.detail;
    this.post.thumbnail = data.thumbnail;
  }
}
