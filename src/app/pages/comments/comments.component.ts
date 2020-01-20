import { Component, OnInit, OnDestroy } from '@angular/core';
import { Comment, createComment } from 'src/app/models/comment.model';
import { CommentsService } from 'src/app/services/comments.service';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Post } from 'src/app/models/post.model';
import { PostService } from '../posts/posts.service';
import { cloneCmsClass, cloneCmsClassArray } from 'src/app/common/util/utils';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent implements OnInit, OnDestroy {

  comments: Comment[] = [];
  posts: Post[] = [];
  isLoading = false;

  constructor(
    private commentService: CommentsService,
    private postService: PostService
  ) { }

  private commentSub: Subscription;
  private postSub: Subscription;
  private loadingSub: Subscription;
  private approvedSub: Subscription;
  private deletedSub: Subscription;

  ngOnDestroy(): void {
    if (this.commentSub) {
      this.commentSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.loadingSub) {
      this.loadingSub.unsubscribe();
    }
    if (this.approvedSub) {
      this.approvedSub.unsubscribe();
    }
    if (this.deletedSub) {
      this.deletedSub.unsubscribe();
    }
  }

  ngOnInit() {
    this.postService.getAllPosts();
    this.postSub = this.postService
      .getPostsChanged()
      .subscribe(aAllPosts => {
        const allPosts = cloneCmsClassArray(aAllPosts);
        this.commentSub = this.commentService.getAllCommentsSubject().subscribe(aAllComments => {
          this.comments = [...aAllComments];
          this.posts = allPosts.filter(aPost => {
            const index = this.comments.findIndex(aComment => aPost.id === aComment.postId);
            return index > -1;
          });
        });
        this.commentService.getAllComments();
      });
    this.loadingSub = this.commentService.getIsLoading().subscribe(aIsLoading => this.isLoading = !!aIsLoading);
    this.approvedSub = this.commentService.getIsApproved().subscribe(() => this.commentService.getAllComments());
    this.deletedSub = this.commentService.getIsDeleted().subscribe(() => this.commentService.getAllComments());
  }

  getCommentsForPost(aPostId: string) {
    return this.comments.filter(aComment => aComment.postId === aPostId);
  }

  getAuthorNames(post: Post): string {
    return post.authors.reduce((acc, aAuthor, aIndex) => {
      return `${aAuthor.name} ${aIndex > 0 ? ',' : ''}${acc}`.trim();
    }, '');
  }

  approveComment(aCommentId: string) {
    this.commentService.approveComment(aCommentId);
  }

  deleteComment(aCommentId: string) {
    this.commentService.deleteComment(aCommentId);
  }

}
