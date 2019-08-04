import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/models/category.model';
import { Issue } from 'src/app/models/issue.model';
import { MyErrorStateMatcher } from 'src/app/app-material-module/error-state-matcher';
import { Thumbnail } from 'src/app/models/thumbnail.model';
import { PostDetail } from 'src/app/models/post-detail.model';



@Component({
  selector: 'app-posts-detail',
  templateUrl: './posts-detail.component.html',
  styleUrls: ['./posts-detail.component.scss']
})
export class PostsDetailComponent implements OnInit {
  postForm: FormGroup;
  post: Post;
  myErrorStateMatcher = new MyErrorStateMatcher();
  constructor(
    private postService: PostService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    const postid = this.activatedRoute.snapshot.params.postid;
    this.post = this.postService.getPost(postid);
    if (!this.post) {
      this.post = new Post();
      this.post.categories = [
        new Category('Poetry', '123', 'Poetry'),
        new Category('Story', '456', 'Story'),
        new Category('Photography', '789', 'Photography')
      ];
      this.post.issues = [
        new Issue('April 2019', '123', 'April 2019'),
        new Issue('Aug 2019', '456', 'Aug 2019'),
        new Issue('Dec 2019', '789', 'Dec 2019')
      ];
    } else {
      this.post = this.post.clone();
    }
    this.postForm = new FormGroup({
      label: new FormControl(this.post.label, [Validators.required]),
      approved: new FormControl(this.post.approved),
      archived: new FormControl(this.post.archived),
      published: new FormControl(this.post.published),
      categories: new FormControl(this.post.categories.map(category => category.id), [Validators.required]),
      issues: new FormControl(this.post.issues.map(issue => issue.id)),
      authors: new FormControl(this.post.authors.join(', '), [Validators.required])
    });
  }

  onThumbnailSaved(data: Thumbnail | PostDetail) {
    console.log('Thumbnail saved');
    console.log(data);
    this.post.thumbnail = data.clone();
  }

  savePost() {
    console.log(this.postForm);
    console.log(this.post.thumbnail);
  }
}
