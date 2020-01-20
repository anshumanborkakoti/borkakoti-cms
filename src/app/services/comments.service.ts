import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Comment, createComment } from 'src/app/models/comment.model';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { cloneCmsClassArray } from 'src/app/common/util/utils';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  private readonly API_URL = `${environment.api_url}/comments`;
  private isSaved = new Subject<boolean>();
  private isLoading = new BehaviorSubject(false);
  private allCommentsSub = new Subject<Comment[]>();
  private isApproved = new Subject<boolean>();
  private isDeleted = new Subject<boolean>();

  constructor(
    private http: HttpClient
  ) { }

  getAllCommentsSubject(): Subject<Comment[]> {
    return this.allCommentsSub;
  }

  getIsLoading(): BehaviorSubject<boolean> {
    return this.isLoading;
  }

  getIsDeleted(): Subject<boolean> {
    return this.isDeleted;
  }

  getIsApproved(): Subject<boolean> {
    return this.isApproved;
  }

  getIsSaved(): Subject<boolean> {
    return this.isSaved;
  }

  getAllComments(): void {
    this.isLoading.next(false);
    this
      .http
      .get<{ code: string, comments: any[] }>
      (`${this.API_URL}`)
      .pipe(map(aResult => aResult.comments.map(aComment => createComment(aComment))))
      .subscribe(aComments => {
        this.allCommentsSub.next(cloneCmsClassArray(aComments));
        this.isLoading.next(false);
      },
        error => {
          this.isLoading.next(false);
          console.error(error);
          this.allCommentsSub.next([]);
        });
  }


  getAllUnapprovedComments(): Subject<Comment[]> {
    const commentsSub = new Subject<Comment[]>();
    this.isLoading.next(false);
    this
      .http
      .get<{ code: string, comments: any[] }>
      (`${this.API_URL}/unapproved`)
      .pipe(map(aResult => aResult.comments.map(aComment => createComment(aComment))))
      .subscribe(aComments => {
        commentsSub.next(cloneCmsClassArray(aComments));
        this.isLoading.next(false);
      },
        error => {
          this.isLoading.next(false);
          console.error(error);
          commentsSub.next([]);
        });
    return commentsSub;
  }

  /**
   * Fetches all or approved or unapproved comments
   */
  getCommentsForPost(postId: string, approved: boolean = null): Subject<Comment[]> {
    const commentsSub = new Subject<Comment[]>();
    this.isLoading.next(false);
    const all = approved === null;
    let url = `${this.API_URL}/${postId}`; // All comments
    if (approved === true) {
      url = `${this.API_URL}/approved/${postId}`;
    } else if (approved === false) {
      url = `${this.API_URL}/unapproved/${postId}`;
    }
    this
      .http
      .get<{ code: string, comments: any[] }>
      (`${this.API_URL}/${postId}`)
      .pipe(map(aResult => aResult.comments.map(aComment => createComment(aComment))))
      .subscribe(aComments => {
        commentsSub.next(cloneCmsClassArray(aComments));
        this.isLoading.next(false);
      },
        error => {
          this.isLoading.next(false);
          console.error(error);
          commentsSub.next([]);
        });
    return commentsSub;
  }

  /**
   * Saves a comment
   * @param aComment Comment to save
   */
  saveComment(aComment: Comment) {
    aComment.timestamp = new Date();
    this.isLoading.next(true);
    this.isSaved.next(false);
    this.http.post<{ code: string }>
      (`${this.API_URL}`, aComment)
      .subscribe(aResult => {
        this.isLoading.next(false);
        this.isSaved.next(true);
      },
        error => {
          this.isLoading.next(false);
          this.isSaved.next(false);
        });
  }

  /**
   * Approves sa comment
   * @param aCommentId Comment id to approve
   */
  approveComment(aCommentId: string): void {
    this.isApproved.next(false);
    this.isLoading.next(true);
    this.http.put<{ code: string, matchedCount: string, modifiedCount: string, upsertedCount: string }>
      (`${this.API_URL}/approve/${aCommentId}`, { approved: true })
      .subscribe(aResult => {
        this.isLoading.next(false);
        this.isApproved.next(true);
      },
        error => {
          this.isLoading.next(false);
          this.isApproved.next(false);
        });
  }
  /**
   * Deletes sa comment
   * @param aCommentId Comment id to delete
   */
  deleteComment(aCommentId: string): Observable<{ code: string }> {
    this.isLoading.next(true);
    this.isDeleted.next(false);
    const observable = this.http.delete<{ code: string }>
      (`${this.API_URL}/${aCommentId}`)
    observable.subscribe(aResult => {
      this.isLoading.next(false);
      this.isDeleted.next(true);
    },
      error => {
        this.isLoading.next(false);
        this.isDeleted.next(false);
      });
    return observable;
  }

}

